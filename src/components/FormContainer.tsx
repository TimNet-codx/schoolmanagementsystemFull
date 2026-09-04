import prisma from "@/lib/prisma";
import FormModal from "./FromModal";
import { getAuthUser } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";

export type FormContainerProps = {
  table:
    | "teacher"
    | "student"
    | "parent"
    | "subject"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "announcement";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number | String;
};

const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {
  let relatedData = {};
  let fetchedData = data;

  // If the type is not delete, fetch related data based on the table type
  if (type !== "delete") {
    switch (table) {
      case "subject":
        const subjectTeachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = { teachers: subjectTeachers };
        break;
      case "class":
        const classGrades = await prisma.grade.findMany({
          select: { id: true, level: true },
        });
        const classTeachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = { grades: classGrades, teachers: classTeachers };
        break;
      case "teacher":
        const teacherSubjects = await prisma.subject.findMany({
          select: { id: true, name: true },
        });
        relatedData = { subjects: teacherSubjects };
        break;
      case "student":
        const studentGrades = await prisma.grade.findMany({
          select: { id: true, level: true },
        });
        const studentClasses = await prisma.class.findMany({
          include: { _count: { select: { students: true } } },
        });
        relatedData = { grades: studentGrades, classes: studentClasses };
        break;
     case "parent":
        // 1. Fetch ALL students for the dropdown options list
        const parentStudents = await prisma.student.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = { students: parentStudents };

        // 2. If updating, fetch THIS specific parent and their existing linked students using "id"
        if (type === "update" && id) {
          fetchedData = await prisma.parent.findUnique({
            where: { id: String(id) },
            include: {
              students: {
                select: { id: true, name: true, surname: true },
              },
            },
          });
        }
        break;
      case "exam":
        // condition for teacher should only add exams for their own subjects and classes, admin can add exams for all subjects and classes
        const { userId, sessionClaims } = await auth();
        const role = (
          sessionClaims?.metadata as {
            role?: "admin" | "teacher" | "student" | "parent";
          }
        )?.role;
        const examLessons = await prisma.lesson.findMany({
          where: {
            // if the user is a teacher, only show lessons for that teacher, userId is the lesson id, if the user is an admin, show all lessons
            ...(role === "teacher" ? { teacherId: userId! } : {}),
          },
          select: { id: true, name: true },
        });
        relatedData = { lessons: examLessons };
        break;
      default:
        break;
    }
  }

  return (
    <div className="">
      <FormModal
        table={table}
        type={type}
        data={data}
        id={id}
        relatedData={relatedData}
      />
    </div>
  );
};

export default FormContainer;
