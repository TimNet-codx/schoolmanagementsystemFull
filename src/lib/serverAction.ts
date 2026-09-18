"use server";

import { revalidatePath } from "next/cache";
import {
  announcementSchema,
  AnnouncementSchema,
  assignmentSchema,
  AssignmentSchema,
  attendanceSchema,
  AttendanceSchema,
  ClassSchema,
  eventSchema,
  EventSchema,
  examSchema,
  ExamSchema,
  lessonSchema,
  LessonSchema,
  ParentSchema,
  resultSchema,
  ResultSchema,
  StudentSchema,
  SubjectSchema,
  TeacherSchema,
} from "./formValidationSchema";
import prisma from "./prisma";
import { success } from "zod";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { error } from "console";

type CurrentState = { success: boolean; error: boolean; message?: string };

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
    return { success: false, error: true, message: "Id not found" };
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
// export const createExam = async (
//   currentState: CurrentState,
//   data: ExamSchema,
// ) => {
//   // condition for teacher should only add exams for their own subjects and classes, admin can add exams for all subjects and classes
//   const { userId, sessionClaims } = await auth();
//   const role = (sessionClaims?.metadata as { role?: string })?.role;

//   try {
//     if (role === "teacher") {
//       // if lesson  belong to us we can an exam
//       const teacherLesson = await prisma.lesson.findFirst({
//         where: {
//           teacherId: userId!,
//           id: data.lessonId,
//         },
//       });

//       if (!teacherLesson) {
//         return { success: false, error: true, message: "Lesson not found" };
//       }

//       await prisma.exam.create({
//         data: {
//           title: data.title,
//           startTime: data.startTime,
//           endTime: data.endTime,
//           lessonId: data.lessonId,
//         },
//       });
//     }

//     // revalidatePath("/list/subjects");
//     return { success: true, error: false };
//   } catch (error) {
//     // console.log(error);
//     return { success: false, error: true };
//   }
// };

export const createExam = async (
  currentState: CurrentState,
  data: ExamSchema,
) => {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    // 1. If teacher, verify they own the lesson
    if (role === "teacher") {
      const teacherLesson = await prisma.lesson.findFirst({
        where: {
          teacherId: userId!,
          id: data.lessonId,
        },
      });

      if (!teacherLesson) {
        return {
          success: false,
          error: true,
          message: "Lesson not found or unauthorized",
        };
      }
    }

    // 2. Create the exam (Runs for BOTH admin and teacher)
    await prisma.exam.create({
      data: {
        title: data.title,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        lessonId: data.lessonId,
      },
    });

    // revalidatePath("/list/exams");
    return { success: true, error: false };
  } catch (error: any) {
    console.error("Create Exam Error:", error);
    return { success: false, error: true, message: error.message };
  }
};

// export const updateExam = async (
//   currentState: CurrentState,
//   data: ExamSchema,
// ) => {
//   // condition for teacher should only add exams for their own subjects and classes, admin can add exams for all subjects and classes
//   const { userId, sessionClaims } = await auth();
//   const role = (sessionClaims?.metadata as { role?: string })?.role;

//   try {
//     if (role === "teacher") {
//       // if lesson  belong to us we can an exam
//       const teacherLesson = await prisma.lesson.findFirst({
//         where: {
//           teacherId: userId!,
//           id: data.lessonId,
//         },
//       });

//       if (!teacherLesson) {
//         return { success: false, error: true, message: "Lesson not found" };
//       }

//       await prisma.exam.update({
//         where: { id: data.id },
//         data: {
//           title: data.title,
//           startTime: new Date(data.startTime),
//           endTime: new Date(data.endTime),
//           lessonId: data.lessonId,
//         },
//       });
//     }

//     // revalidatePath("/list/subjects");
//     return { success: true, error: false };
//   } catch (error) {
//     // console.log(error);
//     return { success: false, error: true };
//   }
// };
export const updateExam = async (
  currentState: CurrentState,
  data: ExamSchema,
) => {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  // 1. Validate ID exists
  if (!data.id) {
    return { success: false, error: true, message: "Exam ID is missing" };
  }

  // 2. Validate input schema
  const validatedFields = examSchema.safeParse(data);
  if (!validatedFields.success) {
    return { success: false, error: true, message: "Invalid form payload" };
  }

  try {
    const { id, title, startTime, endTime, lessonId } = validatedFields.data;

    // 3. If teacher, verify they own the lesson
    if (role === "teacher") {
      const teacherLesson = await prisma.lesson.findFirst({
        where: {
          teacherId: userId!,
          id: lessonId,
        },
      });

      if (!teacherLesson) {
        return {
          success: false,
          error: true,
          message: "Lesson not found or unauthorized",
        };
      }
    }

    // 4. Update the exam in DB (Executes for BOTH admin and teacher)
    await prisma.exam.update({
      where: { id },
      data: {
        title,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        lessonId,
      },
    });

    // 5. Revalidate cache so UI instantly updates
    // revalidatePath("/list/exams");
    return { success: true, error: false };
  } catch (error: any) {
    console.error("Update Exam Error:", error);
    return { success: false, error: true, message: error.message };
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

// Assignment Actions
export const createAssignment = async (
  currentState: CurrentState,
  data: AssignmentSchema,
) => {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    // 1. If teacher, verify they own the lesson
    if (role === "teacher") {
      const teacherLesson = await prisma.lesson.findFirst({
        where: {
          teacherId: userId!,
          id: data.lessonId,
        },
      });

      if (!teacherLesson) {
        return {
          success: false,
          error: true,
          message: "Lesson not found or unauthorized",
        };
      }
    }

    // 2. Create the exam (Runs for BOTH admin and teacher)
    await prisma.assignment.create({
      data: {
        title: data.title,
        startDate: new Date(data.startDate),
        dueDate: new Date(data.dueDate),
        lessonId: data.lessonId,
      },
    });

    // revalidatePath("/list/exams");
    return { success: true, error: false };
  } catch (error: any) {
    console.error("Create Exam Error:", error);
    return { success: false, error: true, message: error.message };
  }
};

export const updateAssignment = async (
  currentState: CurrentState,
  data: AssignmentSchema,
) => {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  // 1. Validate ID exists
  if (!data.id) {
    return { success: false, error: true, message: "Exam ID is missing" };
  }

  // 2. Validate input schema
  const validatedFields = assignmentSchema.safeParse(data);
  if (!validatedFields.success) {
    return { success: false, error: true, message: "Invalid form payload" };
  }

  try {
    const { id, title, startDate, dueDate, lessonId } = validatedFields.data;

    // 3. If teacher, verify they own the lesson
    if (role === "teacher") {
      const teacherLesson = await prisma.lesson.findFirst({
        where: {
          teacherId: userId!,
          id: lessonId,
        },
      });

      if (!teacherLesson) {
        return {
          success: false,
          error: true,
          message: "Lesson not found or unauthorized",
        };
      }
    }

    // 4. Update the exam in DB (Executes for BOTH admin and teacher)
    await prisma.assignment.update({
      where: { id },
      data: {
        title,
        startDate: new Date(startDate),
        dueDate: new Date(dueDate),
        lessonId,
      },
    });

    // 5. Revalidate cache so UI instantly updates
    // revalidatePath("/list/exams");
    return { success: true, error: false };
  } catch (error: any) {
    console.error("Update Exam Error:", error);
    return { success: false, error: true, message: error.message };
  }
};

export const deleteAssignment = async (
  currentState: CurrentState,
  data: FormData,
) => {
  const id = data.get("id") as string;
  // condition for teacher should only delete exams for their own subjects and classes, admin can add exams for all subjects and classes
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  try {
    await prisma.assignment.delete({
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

// Lesson Actions
// export const createLesson = async (
//   currentState: CurrentState,
//   data: LessonSchema,
// ) => {
//   // condition for teacher should only add exams for their own subjects and classes, admin can add exams for all subjects and classes
//   const { userId, sessionClaims } = await auth();
//   const role = (sessionClaims?.metadata as { role?: string })?.role;

//   try {
//     const teacherId = (data as any).teacherId ?? (data as any).teacheId;
//     const lessonPayload: any = {
//       classId: data.classId,
//       teacherId,
//       day: (data as any).day ?? "MONDAY",
//       startTime: (data as any).startTime ?? new Date(),
//       endTime: (data as any).endTime ?? new Date(Date.now() + 60 * 60 * 1000),
//       subjectId: (data as any).subjectId ?? 1,
//     };

//     if (role === "teacher") {
//       const teacherLesson = await prisma.lesson.findFirst({
//         where: {
//           teacherId: userId!,
//           id: data.classId,
//         },
//       });

//       if (!teacherLesson) {
//         return { success: false, error: true, message: "Lesson not found" };
//       }

//       await prisma.lesson.create({
//         data: lessonPayload,
//       });
//     }

//     // revalidatePath("/list/subjects");
//     return { success: true, error: false };
//   } catch (error) {
//     // console.log(error);
//     return { success: false, error: true };
//   }
// };
export const createLesson = async (
  currentState: CurrentState,
  data: LessonSchema,
) => {
  // const { userId, sessionClaims } = await auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  const validatedFields = lessonSchema.safeParse(data);
  if (!validatedFields.success) {
    return { success: false, error: true, message: "Invalid form payload" };
  }

  try {
    const { name, subjectId, classId, teacherId, startTime, endTime } =
      validatedFields.data;

    // Optional: Restrict teachers from creating lessons under another teacher's ID
    // if (role === "teacher" && teacherId !== userId) {
    //   return { success: false, error: true, message: "Unauthorized action" };
    // }

    // Derive day of the week from the start time
    const dayOfWeek = new Date(startTime)
      .toLocaleDateString("en-US", { weekday: "long" })
      .toUpperCase();

    await prisma.lesson.create({
      data: {
        name,
        day: dayOfWeek as any,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        subjectId,
        classId,
        teacherId,
      },
    });

    // revalidatePath("/list/lessons");
    return { success: true, error: false };
  } catch (error: any) {
    console.error("Create Lesson Error:", error);
    return { success: false, error: true, message: error.message };
  }
};

// export const updateLesson = async (
//   currentState: CurrentState,
//   data: LessonSchema,
// ) => {
//   // condition for teacher should only add exams for their own subjects and classes, admin can add exams for all subjects and classes
//   const { userId, sessionClaims } = await auth();
//   const role = (sessionClaims?.metadata as { role?: string })?.role;

//   try {
//     if (!data.id) {
//       return { success: false, error: true, message: "Lesson id is required" };
//     }

//     const teacherId = (data as any).teacherId ?? (data as any).teacheId;
//     const lessonPayload: any = {
//       classId: data.classId,
//       teacherId,
//       day: (data as any).day ?? "MONDAY",
//       startTime: (data as any).startTime ?? new Date(),
//       endTime: (data as any).endTime ?? new Date(Date.now() + 60 * 60 * 1000),
//       subjectId: (data as any).subjectId ?? 1,
//     };

//     if (role === "teacher") {
//       const teacherLesson = await prisma.lesson.findFirst({
//         where: {
//           teacherId: userId!,
//           id: data.id,
//         },
//       });

//       if (!teacherLesson) {
//         return { success: false, error: true, message: "Lesson not found" };
//       }
//     }

//     await prisma.lesson.update({
//       where: { id: data.id },
//       data: lessonPayload,
//     });

//     // revalidatePath("/list/subjects");
//     return { success: true, error: false };
//   } catch (error) {
//     // console.log(error);
//     return { success: false, error: true };
//   }
// };

export const updateLesson = async (
  currentState: CurrentState,
  data: LessonSchema,
) => {
  if (!data.id) {
    return { success: false, error: true, message: "Lesson ID is required" };
  }

  const validatedFields = lessonSchema.safeParse(data);
  if (!validatedFields.success) {
    return { success: false, error: true, message: "Invalid form payload" };
  }

  try {
    const { id, name, subjectId, classId, teacherId, startTime, endTime } =
      validatedFields.data;

    const dayOfWeek = new Date(startTime)
      .toLocaleDateString("en-US", { weekday: "long" })
      .toUpperCase();

    await prisma.lesson.update({
      where: { id },
      data: {
        name,
        day: dayOfWeek as any,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        subjectId,
        classId,
        teacherId,
      },
    });

    // revalidatePath("/list/lessons");
    return { success: true, error: false };
  } catch (error: any) {
    console.error("Update Lesson Error:", error);
    return { success: false, error: true, message: error.message };
  }
};

export const deleteLesson = async (
  currentState: CurrentState,
  data: FormData,
) => {
  const id = data.get("id") as string;
  // condition for teacher should only delete exams for their own subjects and classes, admin can add exams for all subjects and classes
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  try {
    await prisma.lesson.delete({
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

// CREATE RESULT
export const createResult = async (
  currentState: CurrentState,
  data: ResultSchema,
) => {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const validatedFields = resultSchema.safeParse(data);
  if (!validatedFields.success) {
    return { success: false, error: true, message: "Invalid form payload" };
  }

  try {
    const { score, studentId, examId, assignmentId } = validatedFields.data;

    // Optional authorization checks for teachers
    if (role === "teacher") {
      const teacherLesson = await prisma.lesson.findFirst({
        where: {
          teacherId: userId!,
          id: data.assignmentId || data.examId,
        },
      });

      if (!teacherLesson) {
        return {
          success: false,
          error: true,
          message: "Lesson not found or unauthorized",
        };
      }
    }
    await prisma.result.create({
      data: {
        score,
        studentId,
        examId: examId || null,
        assignmentId: assignmentId || null,
      },
    });

    // revalidatePath("/list/results");
    return { success: true, error: false };
  } catch (error: any) {
    console.error("Create Result Error:", error);
    return { success: false, error: true, message: error.message };
  }
};

// UPDATE RESULT
export const updateResult = async (
  currentState: CurrentState,
  data: ResultSchema,
) => {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  if (!data.id) {
    return { success: false, error: true, message: "Result ID is missing" };
  }

  const validatedFields = resultSchema.safeParse(data);
  if (!validatedFields.success) {
    return { success: false, error: true, message: "Invalid form payload" };
  }

  try {
    const { id, score, studentId, examId, assignmentId } = validatedFields.data;

    await prisma.result.update({
      where: { id },
      data: {
        score,
        studentId,
        examId: examId || null,
        assignmentId: assignmentId || null,
      },
    });

    // revalidatePath("/list/results");
    return { success: true, error: false };
  } catch (error: any) {
    console.error("Update Result Error:", error);
    return { success: false, error: true, message: error.message };
  }
};

// DELETE RESULT
export const deleteResult = async (
  currentState: CurrentState,
  data: FormData,
) => {
  const id = data.get("id") as string;

  try {
    await prisma.result.delete({
      where: { id: parseInt(id) },
    });

    revalidatePath("/list/results");
    return { success: true, error: false };
  } catch (error: any) {
    console.error("Delete Result Error:", error);
    return { success: false, error: true, message: error.message };
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

// CREATE EVENT
export const createEvent = async (
  currentState: CurrentState,
  data: EventSchema,
) => {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const validatedFields = eventSchema.safeParse(data);
  if (!validatedFields.success) {
    return { success: false, error: true, message: "Invalid form payload" };
  }

  try {
    const { title, description, startTime, endTime, classId } =
      validatedFields.data;

    await prisma.event.create({
      data: {
        title,
        description,
        startTime,
        endTime,
        classId: classId || null,
      },
    });

    // revalidatePath("/list/events");
    return { success: true, error: false };
  } catch (error: any) {
    console.error("Create Event Error:", error);
    return { success: false, error: true, message: error.message };
  }
};

// UPDATE EVENT
export const updateEvent = async (
  currentState: CurrentState,
  data: EventSchema,
) => {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  if (!data.id) {
    return { success: false, error: true, message: "Event ID is missing" };
  }

  const validatedFields = eventSchema.safeParse(data);
  if (!validatedFields.success) {
    return { success: false, error: true, message: "Invalid form payload" };
  }

  try {
    const { id, title, description, startTime, endTime, classId } =
      validatedFields.data;

    await prisma.event.update({
      where: { id },
      data: {
        title,
        description,
        startTime,
        endTime,
        classId: classId || null,
      },
    });

    // revalidatePath("/list/events");
    return { success: true, error: false };
  } catch (error: any) {
    console.error("Update Event Error:", error);
    return { success: false, error: true, message: error.message };
  }
};

// DELETE EVENT
export const deleteEvent = async (
  currentState: CurrentState,
  data: FormData,
) => {
  const id = data.get("id") as string;

  try {
    await prisma.event.delete({
      where: { id: parseInt(id) },
    });

    // revalidatePath("/list/events");
    return { success: true, error: false };
  } catch (error: any) {
    console.error("Delete Event Error:", error);
    return { success: false, error: true, message: error.message };
  }
};

// CREATE ANNOUNCEMENT
export const createAnnouncement = async (
  currentState: CurrentState,
  data: AnnouncementSchema,
) => {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const validatedFields = announcementSchema.safeParse(data);
  if (!validatedFields.success) {
    return { success: false, error: true, message: "Invalid form payload" };
  }

  try {
    const { title, description, date, classId } = validatedFields.data;

    await prisma.announcement.create({
      data: {
        title,
        description,
        date,
        classId: classId || null,
      },
    });

    // revalidatePath("/list/announcements");
    return { success: true, error: false };
  } catch (error: any) {
    console.error("Create Announcement Error:", error);
    return { success: false, error: true, message: error.message };
  }
};

// UPDATE ANNOUNCEMENT
export const updateAnnouncement = async (
  currentState: CurrentState,
  data: AnnouncementSchema,
) => {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  if (!data.id) {
    return {
      success: false,
      error: true,
      message: "Announcement ID is missing",
    };
  }

  const validatedFields = announcementSchema.safeParse(data);
  if (!validatedFields.success) {
    return { success: false, error: true, message: "Invalid form payload" };
  }

  try {
    const { id, title, description, date, classId } = validatedFields.data;

    await prisma.announcement.update({
      where: { id },
      data: {
        title,
        description,
        date,
        classId: classId || null,
      },
    });

    // revalidatePath("/list/announcements");
    return { success: true, error: false };
  } catch (error: any) {
    console.error("Update Announcement Error:", error);
    return { success: false, error: true, message: error.message };
  }
};

// DELETE ANNOUNCEMENT
export const deleteAnnouncement = async (
  currentState: CurrentState,
  data: FormData,
) => {
  const id = data.get("id") as string;

  try {
    await prisma.announcement.delete({
      where: { id: parseInt(id) },
    });

    // revalidatePath("/list/announcements");
    return { success: true, error: false };
  } catch (error: any) {
    console.error("Delete Announcement Error:", error);
    return { success: false, error: true, message: error.message };
  }
};

// CREATE ATTENDANCE
export const createAttendance = async (
  currentState: CurrentState,
  data: AttendanceSchema,
) => {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const validatedFields = attendanceSchema.safeParse(data);
  if (!validatedFields.success) {
    return { success: false, error: true, message: "Invalid form payload" };
  }

  try {
    const { date, present, studentId, lessonId } = validatedFields.data;

    await prisma.attendance.create({
      data: {
        date,
        present,
        studentId,
        lessonId,
      },
    });

    // revalidatePath("/list/attendance");
    return { success: true, error: false };
  } catch (error: any) {
    console.error("Create Attendance Error:", error);
    return { success: false, error: true, message: error.message };
  }
};

// UPDATE ATTENDANCE
export const updateAttendance = async (
  currentState: CurrentState,
  data: AttendanceSchema,
) => {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  if (!data.id) {
    return { success: false, error: true, message: "Attendance ID is missing" };
  }

  const validatedFields = attendanceSchema.safeParse(data);
  if (!validatedFields.success) {
    return { success: false, error: true, message: "Invalid form payload" };
  }

  try {
    const { id, date, present, studentId, lessonId } = validatedFields.data;

    await prisma.attendance.update({
      where: { id },
      data: {
        date,
        present,
        studentId,
        lessonId,
      },
    });

    // revalidatePath("/list/attendance");
    return { success: true, error: false };
  } catch (error: any) {
    console.error("Update Attendance Error:", error);
    return { success: false, error: true, message: error.message };
  }
};

// DELETE ATTENDANCE
export const deleteAttendance = async (
  currentState: CurrentState,
  data: FormData,
) => {
  const id = data.get("id") as string;

  try {
    await prisma.attendance.delete({
      where: { id: parseInt(id) },
    });

    // revalidatePath("/list/attendance");
    return { success: true, error: false };
  } catch (error: any) {
    console.error("Delete Attendance Error:", error);
    return { success: false, error: true, message: error.message };
  }
};
