import { auth } from "@clerk/nextjs/server";

// const authData = await auth();
// const { userId, sessionClaims } = authData;
// export const role = (sessionClaims?.metadata as { role?: string })?.role;
// export const currentUserId = userId;

export const getAuthUser = async () => {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  return { currentUserId: userId, role };
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
      end: adjustedEndDate

    }
  });
};
