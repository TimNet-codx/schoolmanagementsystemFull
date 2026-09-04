"use server";

import { revalidatePath } from "next/cache";
import {
  ClassSchema,
  ExamSchema,
  ParentSchema,
  StudentSchema,
  SubjectSchema,
  TeacherSchema,
} from "./formValidationSchema";
import prisma from "./prisma";
import { success } from "zod";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { error } from "console";

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
    // console.log(error);
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
    // console.log(error);
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
    // console.log(error);
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
    //console.log(error);
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
    //console.log(error);
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

// Exam Actions
export const createExam = async (
  currentState: CurrentState,
  data: ExamSchema,
) => {
  // condition for teacher should only add exams for their own subjects and classes, admin can add exams for all subjects and classes
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    if (role === "teacher") {
      // if lesson  belong to us we can an exam
      const teacherLesson = await prisma.lesson.findFirst({
        where: {
          teacherId: userId!,
          id: data.lessonId,
        },
      });

      if (!teacherLesson) {
        return { success: false, error: true, message: "Lesson not found" };
      }

      await prisma.exam.create({
        data: {
          title: data.title,
          startTime: data.startTime,
          endTime: data.endTime,
          lessonId: data.lessonId,
        },
      });
    }

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (error) {
    // console.log(error);
    return { success: false, error: true };
  }
};

export const updateExam = async (
  currentState: CurrentState,
  data: ExamSchema,
) => {
  // condition for teacher should only add exams for their own subjects and classes, admin can add exams for all subjects and classes
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    if (role === "teacher") {
      // if lesson  belong to us we can an exam
      const teacherLesson = await prisma.lesson.findFirst({
        where: {
          teacherId: userId!,
          id: data.lessonId,
        },
      });

      if (!teacherLesson) {
        return { success: false, error: true, message: "Lesson not found" };
      }

      await prisma.exam.update({
        where: { id: data.id },
        data: {
          title: data.title,
          startTime: data.startTime,
          endTime: data.endTime,
          lessonId: data.lessonId,
        },
      });
    }

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (error) {
    // console.log(error);
    return { success: false, error: true };
  }
};

export const deleteExam = async (
  currentState: CurrentState,
  data: FormData,
) => {
  const id = data.get("id") as string;
  // condition for teacher should only delete exams for their own subjects and classes, admin can add exams for all subjects and classes
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  try {
    await prisma.exam.delete({
      where: {
        id: parseInt(id),
        ...(role === "teacher" ? { lesson: { teacherId: userId! } } : {}),
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (error) {
    // console.log(error);
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

// Teacher Actions
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
    // console.log(error);

    if (clerkUserId) {
      try {
        const clerk = await clerkClient();
        await clerk.users.deleteUser(clerkUserId);
      } catch (rollbackError) {
        // console.log("Failed to roll back Clerk user:", rollbackError);
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

// export const updateTeacher = async (
//   currentState: CurrentState,
//   data: TeacherSchema,
// ) => {
//   if (!data.id) {
//     return { success: false, error: true };
//   }
//   try {
//     await prisma.teacher.update({
//       where: {
//         id: data.id,
//       },
//       data: {
//         name: data.name,
//         surname: data.surname,
//         username: data.username,
//         ...(data.password ? { password: data.password } : {}),
//         email: data.email || null,
//         phone: data.phone,
//         address: data.address,
//         bloodType: data.bloodType,
//         birthday: data.birthday,
//         sex: data.sex,
//         img: data.img,
//         subjects: {
//           set:
//             data.subjects?.map((subjectId) => ({ id: parseInt(subjectId) })) ||
//             [],
//         },
//       },
//     });

//     // revalidatePath("/list/teachers");
//     return { success: true, error: false };
//   } catch (error) {
//     console.log(error);
//     return { success: false, error: true };
//   }
// };

// export const updateTeacher = async (
//   currentState: CurrentState,
//   data: TeacherSchema,
// ) => {
//   if (!data.id) {
//     return { success: false, error: true, message: "Teacher ID is required!" };
//   }

//   try {
//     const clerk = await clerkClient();

//     // 1. Update Clerk authentication details
//     await clerk.users.updateUser(data.id, {
//       username: data.username,
//       ...(data.password && { password: data.password }),
//       firstName: data.name,
//       lastName: data.surname,
//     });

//     // 2. Update Database details in Prisma
//     await prisma.teacher.update({
//       where: {
//         id: data.id,
//       },
//       data: {
//         name: data.name,
//         surname: data.surname,
//         username: data.username,
//         email: data.email || null,
//         phone: data.phone || null,
//         address: data.address,
//         bloodType: data.bloodType,
//         birthday: data.birthday ? new Date(data.birthday) : undefined,
//         sex: data.sex,
//         img: data.img,
//         subjects: {
//           set:
//             data.subjects?.map((subjectId: string) => ({
//               id: parseInt(subjectId),
//             })) || [],
//         },
//       },
//     });

//     return { success: true, error: false };
//   } catch (error: any) {
//     console.log(error);

//     const uniqueFieldLabels: Record<string, string> = {
//       username: "username",
//       email: "email",
//       phone: "phone",
//     };

//     const getUniqueConstraintMessage = (err: any) => {
//       const target = err?.meta?.target;
//       const field = Array.isArray(target) ? target[0] : target;

//       if (field && uniqueFieldLabels[field]) {
//         return `A teacher with this ${uniqueFieldLabels[field]} already exists.`;
//       }

//       return "Something went wrong!";
//     };

//     const message =
//       error?.code === "P2002"
//         ? getUniqueConstraintMessage(error)
//         : error?.errors?.[0]?.longMessage ||
//           error?.errors?.[0]?.message ||
//           "Something went wrong!";

//     return { success: false, error: true, message };
//   }
// };

export const updateTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema,
) => {
  if (!data.id) {
    return { success: false, error: true, message: "Teacher ID is required!" };
  }

  try {
    const clerk = await clerkClient();

    // Build Clerk update object conditionally
    const clerkUpdateData: Record<string, any> = {
      username: data.username,
      // ...(data.password !== "" && { password: data.password }),
      firstName: data.name,
      lastName: data.surname,
    };

    // Only pass password if the user actually typed a new one
    if (data.password && data.password.trim() !== "") {
      clerkUpdateData.password = data.password;
    }

    // 1. Update Clerk authentication details
    await clerk.users.updateUser(data.id, clerkUpdateData);

    // 2. Update Database details in Prisma
    await prisma.teacher.update({
      where: {
        id: data.id,
      },
      data: {
        // ...(data.password !== "" && { password: data.password }),
        name: data.name,
        surname: data.surname,
        username: data.username,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        bloodType: data.bloodType,
        birthday: data.birthday ? new Date(data.birthday) : undefined,
        sex: data.sex,
        img: data.img,
        subjects: {
          set:
            data.subjects?.map((subjectId: string) => ({
              id: parseInt(subjectId),
            })) || [],
        },
      },
    });

    return { success: true, error: false };
  } catch (error: any) {
    //console.log(error);

    const uniqueFieldLabels: Record<string, string> = {
      username: "username",
      email: "email",
      phone: "phone",
    };

    const getUniqueConstraintMessage = (err: any) => {
      const target = err?.meta?.target;
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

export const deleteTeacher = async (
  currentState: CurrentState,
  data: FormData,
) => {
  const id = data.get("id") as string;
  try {
    await (await clerkClient()).users.deleteUser(id);
    await prisma.teacher.delete({
      where: {
        id: id,
      },
    });

    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (error) {
    //console.log(error);
    return { success: false, error: true };
  }
};

export const createStudent = async (
  currentState: CurrentState,
  data: StudentSchema,
) => {
  let clerkUserId: string | undefined;
  try {
    // If check class is full or still free
    const classItem = await prisma.class.findUnique({
      where: { id: data.classId },
      include: { _count: { select: { students: true } } }, // Include the count of students in the class
    });
    // Check if the class is full
    if (classItem && classItem.capacity <= classItem._count.students) {
      return { success: false, error: true, message: "Class is full!" };
    }

    const clerk = await clerkClient();
    const user = await clerk.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
    });
    clerkUserId = user.id;

    await prisma.student.create({
      data: {
        id: user.id,
        name: data.name,
        surname: data.surname,
        username: data.username,
        email: data.email,
        phone: data.phone,
        address: data.address,
        bloodType: data.bloodType,
        birthday: new Date(data.birthday),
        sex: data.sex,
        img: data.img,
        gradeId: data.gradeId,
        classId: data.classId,
        parentId: data.parentId,
      },
    });

    return { success: true, error: false };
  } catch (error: any) {
    //console.log(error);

    if (clerkUserId) {
      try {
        const clerk = await clerkClient();
        await clerk.users.deleteUser(clerkUserId);
      } catch (rollbackError) {
        // console.log("Failed to roll back Clerk user:", rollbackError);
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
        return `A Student with this ${uniqueFieldLabels[field]} already exists.`;
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

// export const updateStudent = async (
//   currentState: CurrentState,
//   data: StudentSchema,
// ) => {
//   if (!data.id) {
//     return { success: false, error: true, message: "Student ID is required!" };
//   }

//   try {
//     // If check class is full or still free
//     const classItem = await prisma.class.findUnique({
//       where: { id: data.classId },
//       include: { _count: { select: { students: true } } }, // Include the count of students in the class
//     });
//     // Check if the class is full
//     if (classItem && classItem.capacity <= classItem._count.students) {
//       return { success: false, error: true, message: "Class is full!" };
//     }
//     const clerk = await clerkClient();

//     // Build Clerk update object conditionally
//     const clerkUpdateData: Record<string, any> = {
//       username: data.username,
//       // ...(data.password !== "" && { password: data.password }),
//       firstName: data.name,
//       lastName: data.surname,
//     };

//     // Only pass password if the user actually typed a new one
//     if (data.password && data.password.trim() !== "") {
//       clerkUpdateData.password = data.password;
//     }

//     // 1. Update Clerk authentication details
//     await clerk.users.updateUser(data.id, clerkUpdateData);
// 1. Update Clerk authentication details
//     // 2. Update Database details in Prisma
//     await prisma.student.update({
//       where: {
//         id: data.id,
//       },
//       data: {
//         // ...(data.password !== "" && { password: data.password }),
//         name: data.name,
//         surname: data.surname,
//         username: data.username,
//         email: data.email || null,
//         phone: data.phone || null,
//         address: data.address,
//         bloodType: data.bloodType,
//         birthday: data.birthday ? new Date(data.birthday) : undefined,
//         sex: data.sex,
//         img: data.img,
//         gradeId: data.gradeId,
//         classId: data.classId,
//         parentId: data.parentId,
//       },
//     });

//     return { success: true, error: false };
//   } catch (error: any) {
//     console.log(error);

//     const uniqueFieldLabels: Record<string, string> = {
//       username: "username",
//       email: "email",
//       phone: "phone",
//     };

//     const getUniqueConstraintMessage = (err: any) => {
//       const target = err?.meta?.target;
//       const field = Array.isArray(target) ? target[0] : target;

//       if (field && uniqueFieldLabels[field]) {
//         return `A Student with this ${uniqueFieldLabels[field]} already exists.`;
//       }

//       return "Something went wrong!";
//     };

//     const message =
//       error?.code === "P2002"
//         ? getUniqueConstraintMessage(error)
//         : error?.errors?.[0]?.longMessage ||
//           error?.errors?.[0]?.message ||
//           "Something went wrong!";

//     return { success: false, error: true, message };
//   }
// };

// export const updateStudent = async (
//   currentState: CurrentState,
//   data: StudentSchema,
// ) => {
//   if (!data.id) {
//     return { success: false, error: true, message: "Student ID is required!" };
//   }

//   try {
//     // 1. Fetch current student record to compare changes
//     const currentStudent = await prisma.student.findUnique({
//       where: { id: data.id },
//       select: { classId: true },
//     });

//     if (!currentStudent) {
//       return { success: false, error: true, message: "Student not found!" };
//     }

//     // 2. Only check class capacity if the student is switching to a NEW class
//     if (currentStudent.classId !== data.classId) {
//       const classItem = await prisma.class.findUnique({
//         where: { id: data.classId },
//         include: { _count: { select: { students: true } } },
//       });

//       if (classItem && classItem.capacity <= classItem._count.students) {
//         return { success: false, error: true, message: "Class is full!" };
//       }
//     }

//     const clerk = await clerkClient();

//     // 3. Build Clerk update payload
//     const clerkUpdateData: Record<string, any> = {
//       username: data.username,
//       firstName: data.name,
//       lastName: data.surname,
//     };

//     if (data.password && data.password.trim() !== "") {
//       clerkUpdateData.password = data.password;
//     }

//     // Update Clerk
//     await clerk.users.updateUser(data.id, clerkUpdateData);

//     // 4. Update Prisma Database
//     await prisma.student.update({
//       where: { id: data.id },
//       data: {
//         name: data.name,
//         surname: data.surname,
//         username: data.username,
//         email: data.email || null,
//         phone: data.phone || null,
//         address: data.address,
//         bloodType: data.bloodType,
//         birthday: data.birthday ? new Date(data.birthday) : undefined,
//         sex: data.sex,
//         img: data.img || null,
//         gradeId: data.gradeId,
//         classId: data.classId,
//         parentId: data.parentId,
//       },
//     });

//     return { success: true, error: false };
//   } catch (error: any) {
//     console.error("updateStudent Error:", error);

//     const uniqueFieldLabels: Record<string, string> = {
//       username: "username",
//       email: "email",
//       phone: "phone",
//     };

//     const getUniqueConstraintMessage = (err: any) => {
//       const target = err?.meta?.target;
//       const field = Array.isArray(target) ? target[0] : target;

//       if (field && uniqueFieldLabels[field]) {
//         return `A Student with this ${uniqueFieldLabels[field]} already exists.`;
//       }

//       return "Something went wrong!";
//     };

//     const message =
//       error?.code === "P2002"
//         ? getUniqueConstraintMessage(error)
//         : error?.errors?.[0]?.longMessage ||
//           error?.errors?.[0]?.message ||
//           error?.message ||
//           "Something went wrong!";

//     return { success: false, error: true, message };
//   }
// };

export const updateStudent = async (
  currentState: CurrentState,
  data: StudentSchema,
) => {
  if (!data.id) {
    return { success: false, error: true, message: "Student ID is required!" };
  }

  const classIdNum = Number(data.classId);
  const gradeIdNum = Number(data.gradeId);

  try {
    // 1. Fetch current student record to compare changes
    const currentStudent = await prisma.student.findUnique({
      where: { id: data.id },
      select: { classId: true },
    });

    if (!currentStudent) {
      return { success: false, error: true, message: "Student not found!" };
    }
    // If check class is full or still free
    if (currentStudent.classId !== classIdNum) {
      const classItem = await prisma.class.findUnique({
        where: { id: classIdNum },
        include: { _count: { select: { students: true } } },
      });
      // Check if the class is full
      if (classItem && classItem.capacity <= classItem._count.students) {
        return { success: false, error: true, message: "Class is full!" };
      }
    }

    const clerk = await clerkClient();
    // Build Clerk update object conditionally
    const clerkUpdateData: Record<string, any> = {
      username: data.username,
      firstName: data.name,
      lastName: data.surname,
    };

    // Only pass password if the user actually typed a new one
    if (data.password && data.password.trim() !== "") {
      clerkUpdateData.password = data.password;
    }

    //Update Clerk authentication details
    await clerk.users.updateUser(data.id, clerkUpdateData);

    // Update Database details in Prisma
    await prisma.student.update({
      where: { id: data.id },
      data: {
        name: data.name,
        surname: data.surname,
        username: data.username,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        bloodType: data.bloodType,
        birthday: data.birthday ? new Date(data.birthday) : undefined,
        sex: data.sex,
        img: data.img || null,
        gradeId: gradeIdNum,
        classId: classIdNum,
        parentId: data.parentId,
      },
    });

    return { success: true, error: false };
  } catch (error: any) {
    // console.error("updateStudent Error:", error);

    const uniqueFieldLabels: Record<string, string> = {
      username: "username",
      email: "email",
      phone: "phone",
    };

    const getUniqueConstraintMessage = (err: any) => {
      const target = err?.meta?.target;
      const field = Array.isArray(target) ? target[0] : target;

      if (field && uniqueFieldLabels[field]) {
        return `A Student with this ${uniqueFieldLabels[field]} already exists.`;
      }

      return "Something went wrong!";
    };

    const message =
      error?.code === "P2002"
        ? getUniqueConstraintMessage(error)
        : error?.errors?.[0]?.longMessage ||
          error?.errors?.[0]?.message ||
          error?.message ||
          "Something went wrong!";

    return { success: false, error: true, message };
  }
};

export const deleteStudent = async (
  currentState: CurrentState,
  data: FormData,
) => {
  const id = data.get("id") as string;
  try {
    await (await clerkClient()).users.deleteUser(id);
    await prisma.student.delete({
      where: {
        id: id,
      },
    });

    // revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (error) {
    // console.log(error);
    return { success: false, error: true };
  }
};

// Parent Actions
// export const createParent = async (
//   currentState: CurrentState,
//   data: ParentSchema,
// ) => {
//   let clerkUserId: string | undefined;

//   try {
//     const clerk = await clerkClient();
//     const user = await clerk.users.createUser({
//       username: data.username,
//       password: data.password,
//       firstName: data.name,
//       lastName: data.surname,
//     });
//     clerkUserId = user.id;

//     await prisma.parent.create({
//       data: {
//         id: user.id,
//         name: data.name,
//         surname: data.surname,
//         username: data.username,
//         email: data.email,
//         phone: data.phone,
//         address: data.address,
//         sex: data.sex,
//         students: {
//           connect: data.students?.map((studentId: string) => ({
//             id: studentId,
//           })),
//         },
//       },
//     });

//     return { success: true, error: false };
//   } catch (error: any) {
//     // console.log(error);

//     if (clerkUserId) {
//       try {
//         const clerk = await clerkClient();
//         await clerk.users.deleteUser(clerkUserId);
//       } catch (rollbackError) {
//         // console.log("Failed to roll back Clerk user:", rollbackError);
//       }
//     }

//     const uniqueFieldLabels: Record<string, string> = {
//       username: "username",
//       email: "email",
//       phone: "phone",
//     };

//     const getUniqueConstraintMessage = (error: any) => {
//       const target = error?.meta?.target;
//       const field = Array.isArray(target) ? target[0] : target;

//       if (field && uniqueFieldLabels[field]) {
//         return `A Parent with this ${uniqueFieldLabels[field]} already exists.`;
//       }

//       return "Something went wrong!";
//     };

//     const message =
//       error?.code === "P2002"
//         ? getUniqueConstraintMessage(error)
//         : error?.errors?.[0]?.longMessage ||
//           error?.errors?.[0]?.message ||
//           "Something went wrong!";

//     return { success: false, error: true, message };
//   }
// };

export const createParent = async (
  currentState: CurrentState,
  data: ParentSchema,
) => {
  let clerkUserId: string | undefined;

  try {
    const clerk = await clerkClient();

    // 1. Create User in Clerk
    const user = await clerk.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      ...(data.email ? { emailAddress: [data.email] } : {}),
    });
    clerkUserId = user.id;

    // 3. Create Parent in Prisma
    await prisma.parent.create({
      data: {
        id: user.id,
        name: data.name,
        surname: data.surname,
        username: data.username,
        email: data.email || null,
        phone: data.phone,
        address: data.address,
        sex: data.sex,
        students: {
          connect: data.students?.map((studentId: string) => ({
            id: studentId,
          })),
        },
      },
    });

    return { success: true, error: false };
  } catch (error: any) {
    console.error("CREATE_PARENT_ERROR:", error);

    // Roll back Clerk user creation if Prisma insert fails
    if (clerkUserId) {
      try {
        const clerk = await clerkClient();
        await clerk.users.deleteUser(clerkUserId);
      } catch (rollbackError) {
        console.error("Failed to roll back Clerk user:", rollbackError);
      }
    }

    const uniqueFieldLabels: Record<string, string> = {
      username: "username",
      email: "email",
      phone: "phone",
    };

    const getUniqueConstraintMessage = (err: any) => {
      const target = err?.meta?.target;
      const field = Array.isArray(target) ? target[0] : target;

      if (field && uniqueFieldLabels[field]) {
        return `A Parent with this ${uniqueFieldLabels[field]} already exists.`;
      }

      return "A record with these details already exists.";
    };

    const message =
      error?.code === "P2002"
        ? getUniqueConstraintMessage(error)
        : error?.errors?.[0]?.longMessage ||
          error?.errors?.[0]?.message ||
          error?.message ||
          "Something went wrong!";

    return { success: false, error: true, message };
  }
};

export const updateParent = async (
  currentState: CurrentState,
  data: ParentSchema,
) => {
  if (!data.id) {
    return { success: false, error: true, message: "Parent ID is required!" };
  }

  try {
    const clerk = await clerkClient();

    // 1. Build Clerk update payload
    const clerkUpdateData: Record<string, any> = {
      username: data.username,
      firstName: data.name,
      lastName: data.surname,
    };

    // Update password only if provided
    if (data.password && data.password.trim() !== "") {
      clerkUpdateData.password = data.password;
    }

    // Update Clerk user
    await clerk.users.updateUser(data.id, clerkUpdateData);

    // 3. Update Parent record in Prisma
    await prisma.parent.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        surname: data.surname,
        username: data.username,
        email: data.email || null,
        phone: data.phone,
        address: data.address,
        sex: data.sex,
        students: {
          set: data.students?.map((studentId: string) => ({
            id: studentId,
          })),
        },
      },
    });

    return { success: true, error: false };
  } catch (error: any) {
    console.error("UPDATE_PARENT_ERROR:", error);

    const uniqueFieldLabels: Record<string, string> = {
      username: "username",
      email: "email",
      phone: "phone",
    };

    const getUniqueConstraintMessage = (err: any) => {
      const target = err?.meta?.target;
      const field = Array.isArray(target) ? target[0] : target;

      if (field && uniqueFieldLabels[field]) {
        return `A parent with this ${uniqueFieldLabels[field]} already exists.`;
      }

      return "A record with these details already exists.";
    };

    const message =
      error?.code === "P2002"
        ? getUniqueConstraintMessage(error)
        : error?.errors?.[0]?.longMessage ||
          error?.errors?.[0]?.message ||
          error?.message ||
          "Something went wrong!";

    return { success: false, error: true, message };
  }
};

export const deleteParent = async (
  currentState: CurrentState,
  data: FormData,
) => {
  const id = data.get("id") as string;
  try {
    await (await clerkClient()).users.deleteUser(id);
    await prisma.parent.delete({
      where: {
        id: id,
      },
    });

    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (error) {
    //console.log(error);
    return { success: false, error: true };
  }
};
