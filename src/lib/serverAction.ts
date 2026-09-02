"use server";

import { revalidatePath } from "next/cache";
import {
  ClassSchema,
  SubjectSchema,
  TeacherSchema,
} from "./formValidationSchema";
import prisma from "./prisma";
import { success } from "zod";
import { clerkClient } from "@clerk/nextjs/server";

type CurrentState = { success: boolean; error: boolean };

// Subject Actions
export const createSubject = async (
  currentState: CurrentState,
  data: SubjectSchema,
) => {
  try {
    await prisma.subject.create({
      data: {
        name: data.name,
        teachers: {
          connect: data.teachers?.map((teacherId) => ({ id: teacherId })),
        },
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

export const updateSubject = async (
  currentState: CurrentState,
  data: SubjectSchema,
) => {
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    await prisma.subject.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        teachers: {
          set: data.teachers.map((teacherId) => ({ id: teacherId })),
        },
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

export const deleteSubject = async (
  currentState: CurrentState,
  data: FormData,
) => {
  const id = data.get("id") as string;
  try {
    await prisma.subject.delete({
      where: {
        id: parseInt(id),
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

// Class Actions
export const createClass = async (
  currentState: CurrentState,
  data: ClassSchema,
) => {
  try {
    await prisma.class.create({
      data: {
        name: data.name,
        capacity: data.capacity,
        gradeId: data.gradeId,
        supervisorId: data.supervisorId,
      },
    });

    // revalidatePath("/list/classes");
    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

export const updateClass = async (
  currentState: CurrentState,
  data: ClassSchema,
) => {
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    await prisma.class.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        capacity: data.capacity,
        gradeId: data.gradeId,
        supervisorId: data.supervisorId,
      },
    });

    // revalidatePath("/list/classes");
    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

export const deleteClass = async (
  currentState: CurrentState,
  data: FormData,
) => {
  const id = data.get("id") as string;
  try {
    await prisma.class.delete({
      where: {
        id: parseInt(id),
      },
    });

    // revalidatePath("/list/classes");
    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

// Teacher Actions
// export const createTeacher = async (
//   currentState: CurrentState,
//   data: TeacherSchema,
// ) => {
//     if (!data.id) {
//     return { success: false, error: true };
//   }
//   try {

//     const clerk = await clerkClient();
//     const user = await clerk.users.createUser({
//       username: data.username,
//       password: data.password,
//       firstName: data.name,
//       lastName: data.surname,
//     })

//     await prisma.teacher.update({
//       where: {
//         id: data.id,
//       },
//       data: {
//         id: user.id,
//          name: data.name,
//          surname: data.surname,
//          username: data.username,
//          password: data.password,
//          email: data.email,
//          phone: data.phone,
//          address: data.address,
//          bloodType: data.bloodType,
//          birthday: data.birthday,
//          sex: data.sex,
//          img: data.img,
//         subjects: {
//           connect: data.subjects?.map((subjectId: string) => ({ id: parseInt(subjectId) })),
//         },
//         },
//     });

//     // revalidatePath("/list/teachers");
//     return { success: true, error: false };
//   } catch (error) {
//     console.log(error);
//     return { success: false, error: true };
//   }
// };

// export const createTeacher = async (
//   currentState: CurrentState,
//   data: TeacherSchema,
// ) => {
//   try {
//     const clerk = await clerkClient();
//     const user = await clerk.users.createUser({
//       username: data.username,
//       password: data.password,
//       firstName: data.name,
//       lastName: data.surname,
//     });

//     await prisma.teacher.create({
//       data: {
//         id: user.id,
//         name: data.name,
//         surname: data.surname,
//         username: data.username,
//         email: data.email,
//         phone: data.phone,
//         address: data.address,
//         bloodType: data.bloodType,
//         birthday: data.birthday,
//         sex: data.sex,
//         img: data.img,
//         subjects: {
//           connect: data.subjects?.map((subjectId: string) => ({
//             id: parseInt(subjectId),
//           })),
//         },
//       },
//     });

//     return { success: true, error: false };
//   } catch (error: any) {
//     console.log(error);
//     const message =
//       error?.errors?.[0]?.longMessage ||
//       error?.errors?.[0]?.message ||
//       "Something went wrong!";
//     return { success: false, error: true, message };
//   }
// };

export const createTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema,
) => {
  let clerkUserId: string | undefined;

  try {
    const clerk = await clerkClient();
    const user = await clerk.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
    });
    clerkUserId = user.id;

    await prisma.teacher.create({
      data: {
        id: user.id,
        name: data.name,
        surname: data.surname,
        username: data.username,
        email: data.email,
        phone: data.phone,
        address: data.address,
        bloodType: data.bloodType,
        birthday: data.birthday,
        sex: data.sex,
        img: data.img,
        subjects: {
          connect: data.subjects?.map((subjectId: string) => ({
            id: parseInt(subjectId),
          })),
        },
      },
    });

    return { success: true, error: false };
  } catch (error: any) {
    console.log(error);

    if (clerkUserId) {
      try {
        const clerk = await clerkClient();
        await clerk.users.deleteUser(clerkUserId);
      } catch (rollbackError) {
        console.log("Failed to roll back Clerk user:", rollbackError);
      }
    }

    const uniqueFieldLabels: Record<string, string> = {
      username: "username",
      email: "email",
      phone: "phone",
    };

    const getUniqueConstraintMessage = (error: any) => {
      const target = error?.meta?.target;
      const field = Array.isArray(target) ? target[0] : target;

      if (field && uniqueFieldLabels[field]) {
        return `A teacher with this ${uniqueFieldLabels[field]} already exists.`;
      }

      return "Something went wrong!";
    };

    const message =
      error?.code === "P2002"
        ? getUniqueConstraintMessage(error)
        : error?.errors?.[0]?.longMessage ||
          error?.errors?.[0]?.message ||
          "Something went wrong!";

    return { success: false, error: true, message };
  }
};

export const updateTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema,
) => {
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    await prisma.teacher.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        surname: data.surname,
        username: data.username,
        ...(data.password ? { password: data.password } : {}),
        email: data.email || null,
        phone: data.phone,
        address: data.address,
        bloodType: data.bloodType,
        birthday: data.birthday,
        sex: data.sex,
        img: data.img,
        subjects: {
          set:
            data.subjects?.map((subjectId) => ({ id: parseInt(subjectId) })) ||
            [],
        },
      },
    });

    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

export const deleteTeacher = async (
  currentState: CurrentState,
  data: FormData,
) => {
  const id = data.get("id") as string;
  try {
    await prisma.teacher.delete({
      where: {
        id: id,
      },
    });

    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};
