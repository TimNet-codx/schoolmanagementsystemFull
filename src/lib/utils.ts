import { auth } from "@clerk/nextjs/server";

// const authData = await auth();
// const { userId, sessionClaims } = authData;
// export const role = (sessionClaims?.metadata as { role?: string })?.role;
// export const currentUserId = userId;
type CurrentState = { success: boolean; error: boolean; message?: string };;
class UserError extends Error {}
const fail = (message: string): CurrentState => ({ success: false, error: true, message });
const ok = (): CurrentState => ({ success: true, error: false });

export const getAuthUser = async () => {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  return { currentUserId: userId, role };
};

export const isAdminCaller = async () => {
  const { userId, sessionClaims } = await auth();
  return (sessionClaims?.metadata as any)?.role === "admin";
};
export async function requireAdmin() {
  const { role, currentUserId } = await getAuthUser();
  if (role !== "admin") throw new UserError("Only an admin can do this.");
  return currentUserId as string;
}

export const handle = (e: unknown): CurrentState => {
  if (e instanceof UserError) return fail(e.message);
  console.error(e);
  return fail("Something went wrong!");
};

// export const getAdminErrorMessage = (error: any) => {
//   if (error?.code === "P2002") {
//     return "An admin with this username already exists";
//   }
//   return (
//     error?.errors?.[0]?.lonfMessage ||
//     error?.error?.[0]?.message ||
//     " Something went wrong!!!"
//   );
// };

export const getAdminErrorMessage = (error: any) => {
  // 1. Prisma Unique Constraint Violations (e.g., Duplicate Username, Email, or Phone)
  if (error?.code === "P2002") {
    const target = error?.meta?.target;
    if (Array.isArray(target) && target.length > 0) {
      return `An admin with this ${target.join(", ")} already exists.`;
    }
    return "An admin with this username or email already exists.";
  }

  // 2. Clerk API / Form Errors (fixed typo: longMessage instead of lonfMessage)
  if (error?.errors?.[0]?.longMessage) {
    return error.errors[0].longMessage;
  }

  if (error?.errors?.[0]?.message) {
    return error.errors[0].message;
  }

  // 3. Standard JavaScript / Server Action Errors
  if (error?.message) {
    return error.message;
  }

  // 4. Default Fallback
  return "Something went wrong!!!";
};  

const currentWorkWeek = () => {
  const today = new Date();
  const dayOfWeek = today.getDate();

  const startOfWeek = new Date(today);

  // if start day of the week is sunday, let the working day start from monday +1 == Monday
  if (dayOfWeek === 0) {
    startOfWeek.setDate(today.getDate() + 1);
  }
  // if the day is Satutday  we are going to get the next monday +2
  if (dayOfWeek === 6) {
    startOfWeek.setDate(today.getDate() + 2);
  } else {
    // getting the day before
    startOfWeek.setDate(today.getDate() - (dayOfWeek - 1));
  }

  startOfWeek.setHours(0, 0, 0, 0);

  // Get End of the week Friday
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 4);
  endOfWeek.setHours(23, 59, 59, 999);

  return { startOfWeek, endOfWeek };
};

export const adjustScheduleToCurrentweek = (
  lessons: { title: string; start: Date; end: Date }[],
): { title: string; start: Date; end: Date }[] => {
  const { startOfWeek } = currentWorkWeek();

  return lessons.map((lesson) => {
    const lessonDayOfWeek = lesson.start.getDay();

    const daysFromMonday = lessonDayOfWeek === 0 ? 6 : lessonDayOfWeek - 1;

    const adjustedStartDate = new Date(startOfWeek);

    adjustedStartDate.setDate(startOfWeek.getDate() + daysFromMonday);
    // const adjustedStartDate = new Date(adjustedStartDate);
    adjustedStartDate.setHours(
      lesson.start.getHours(),
      lesson.start.getMinutes(),
      lesson.start.getSeconds(),
    );

    const adjustedEndDate = new Date(adjustedStartDate);
    adjustedEndDate.setHours(
      lesson.end.getHours(),
      lesson.end.getMinutes(),
      lesson.end.getSeconds(),
    );

    return {
      title: lesson.title,
      start: adjustedStartDate,
      end: adjustedEndDate,
    };
  });
};


export const receiptNo = () =>
  `TN-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 1296)
    .toString(36)
    .toUpperCase()
    .padStart(2, "0")}`;
