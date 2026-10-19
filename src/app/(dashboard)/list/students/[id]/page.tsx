// import Announcements from "@/components/Announcements";
// import BigCalendar from "@/components/BigCalender";
// import Performance from "@/components/Performance";
// import Image from "next/image";
// import Link from "next/link";
// import { getAuthUser } from "@/lib/utils";
// import prisma from "@/lib/prisma";
// import { Class, Student } from "@/generated/prisma/client";
// import { notFound } from "next/navigation";
// import FormContainer from "@/components/FormContainer";
// import BigCalenderContainer from "@/components/BigCalenderContainer";
// import { Suspense } from "react";
// import StudentAttendance from "@/components/StudentAttendace";
// import StudentAttendanceCard from "@/components/StudentAttendace";


// const SingleStudentPage = async ({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) => {
//   const { id } = await params;
//   const { role } = await getAuthUser();
//   const student: | (Student & { class: Class & { _count: { lessons: number } } } ) | null = await prisma.student.findUnique({
//     where: { id },
//     include:{
//       class: {
//         include: {
//           _count: {
//             select: {
//               lessons: true
//             }
//           }
//         }
//       }
//     }
//   });

//   console.log("student", student);

//   if (!student) {
//     return notFound();
//   }

//   return (
//     <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
//       {/* LEFT */}
//       <div className="w-full xl:w-2/3">
//         {/* TOP */}
//         <div className="flex flex-col lg:flex-row gap-4">
//           {/* USER INFO CARD */}
//           <div className="bg-[#C3EBFA] py-6 px-4 rounded-md flex-1 flex gap-4">
//             <div className="w-1/3">
//               <Image
//                 src={student.img || "/noAvatar.png"}
//                 width={144}
//                 height={144}
//                 className="w-36 h-36 rounded-full object-cover" alt={""}/>
//             </div>
//             <div className="w-2/3 flex flex-col justify-between gap-4">
//               {/* <h1 className="text-xl font-semibold">{student.name + " " + student.surname}</h1> */}
//               <div className="flex items-center gap-4">
//                 <h1 className="text-xl font-semibold">
//                   {student.name + " " + student.surname}
//                 </h1>
//                 {role === "admin" && (
//                   <FormContainer
//                     table="student"
//                     type="update"
//                     data={student}
//                   />
//                 )}
//               </div>
//               <p className="text-sm text-gray-500">
//                 Lorem ipsum, dolor sit amet consectetur adipisicing elit.
//               </p>
//               <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
//                 <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
//                   <Image src="/blood.png" alt="" width={14} height={14} />
//                   <span>{student.bloodType}</span>
//                 </div>
//                 <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
//                   <Image src="/date.png" alt="" width={14} height={14} />
//                   <span>{student.birthday.toLocaleDateString()}</span>
//                 </div>
//                 <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
//                   <Image src="/mail.png" alt="" width={14} height={14} />
//                   <span>{student.email || "-"}</span>
//                 </div>
//                 <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
//                   <Image src="/phone.png" alt="" width={14} height={14} />
//                   <span>{student.phone || "-"}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//           {/* SMALL CARDS */}
//           <div className="flex-1 flex gap-4 justify-between flex-wrap">
//             {/* CARD */}
//             <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
//               <Image
//                 src="/singleAttendance.png"
//                 alt=""
//                 width={24}
//                 height={24}
//                 className="w-6 h-6"
//               />
//               <Suspense fallback={<div>Loading...</div>}>
//                 <StudentAttendanceCard id={student.id} />
//               </Suspense>
             
//             </div>
//             {/* CARD */}
//             <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
//               <Image
//                 src="/singleBranch.png"
//                 alt=""
//                 width={24}
//                 height={24}
//                 className="w-6 h-6"
//               />
//               <div className="">
//                 <h1 className="text-xl font-semibold">{student.class.name.charAt(0)}th</h1>
//                 <span className="text-sm text-gray-400">Grade</span>
//               </div>
//             </div>
//             {/* CARD */}
//             <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
//               <Image
//                 src="/singleLesson.png"
//                 alt=""
//                 width={24}
//                 height={24}
//                 className="w-6 h-6"
//               />
//               <div className="">
//                 <h1 className="text-xl font-semibold">{student.class._count.lessons}</h1>
//                 <span className="text-sm text-gray-400">Lessons</span>
//               </div>
//             </div>
//             {/* CARD */}
//             <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
//               <Image
//                 src="/singleClass.png"
//                 alt=""
//                 width={24}
//                 height={24}
//                 className="w-6 h-6"
//               />
//               <div className="">
//                 <h1 className="text-xl font-semibold">6A</h1>
//                 <span className="text-sm text-gray-400">Class</span>
//               </div>
//             </div>
//           </div>
//         </div>
//         {/* BOTTOM */}
//         <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
//           <h1>Student&apos;s Schedule</h1>
//           <BigCalenderContainer type="classId" id={student.class.id} />

//         </div>
//       </div>
//       {/* RIGHT */}
//       <div className="w-full xl:w-1/3 flex flex-col gap-4">
//         <div className="bg-white p-4 rounded-md">
//           <h1 className="text-xl font-semibold">Shortcuts</h1>
//           <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
//                     <Link className="p-3 rounded-md bg-[#EDF9FD]" href={`/list/lessons?classId=${2}`}>Student&apos;s Lessons</Link>
//                     <Link className="p-3 rounded-md bg-[#F1F0FF]" href={`/list/teachers?classId=${2}`}>Student&apos;s Teachers</Link>
//                     {/* <Link className="p-3 rounded-md bg-[#FEFCE8]" href={`/list/classes?studentId=${"student2"}`}>Student&apos;s Class</Link> */}

//                     <Link className="p-3 rounded-md bg-pink-50" href={`/list/exams?classId=${2}`}>Student&apos;s Exams</Link>
//                     <Link className="p-3 rounded-md bg-[#EDF9FD]" href={`/list/assignments?classId=${2}`}>Student&apos;s Assignments</Link>
//                     <Link className="p-3 rounded-md bg-[#FEFCE8]" href={`/list/results?studentId=${"student2"}`}>Student&apos;s Results</Link>
//                 </div>
//         </div>
//         <Performance />
//         <Announcements />
//       </div>
//     </div>
//   );
// };

// export default SingleStudentPage;

import Announcements from "@/components/Announcements";
import BigCalenderContainer from "@/components/BigCalenderContainer";
import FormContainer from "@/components/FormContainer";
import Performance from "@/components/Performance";
import StudentAttendanceCard from "@/components/StudentAttendace";
import { Class, Grade, Student } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/utils";
import {
  CalendarCheck,
  CalendarDays,
  Droplets,
  GraduationCap,
  Mail,
  Phone,
  Presentation,
  School,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReactNode, Suspense } from "react";

const InfoItem = ({ icon, children }: { icon: ReactNode; children: ReactNode }) => (
  <div className="flex items-center gap-2 text-xs text-gray-600 min-w-0">
    <span className="text-blue-500 shrink-0">{icon}</span>
    <span className="truncate">{children}</span>
  </div>
);

const CardShell = ({ icon, children }: { icon: ReactNode; children: ReactNode }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div>{children}</div>
  </div>
);

const StatCard = ({
  icon,
  value,
  label,
}: {
  icon: ReactNode;
  value: ReactNode;
  label: string;
}) => (
  <CardShell icon={icon}>
    <p className="text-xl font-bold text-gray-900 leading-none">{value}</p>
    <p className="text-[10px] font-semibold tracking-wider text-gray-500 mt-1 uppercase">
      {label}
    </p>
  </CardShell>
);

const SingleStudentPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const { role } = await getAuthUser();

  const student:
    | (Student & {
        class: Class & { _count: { lessons: number } };
        grade: Grade | null;
      })
    | null = await prisma.student.findUnique({
    where: { id },
    include: {
      grade: true,
      class: { include: { _count: { select: { lessons: true } } } },
    },
  });

  if (!student) return notFound();

  const classId = student.class.id;

  const shortcuts = [
    { label: "Lessons", href: `/list/lessons?classId=${classId}`, tone: "bg-blue-50 text-blue-700 border-blue-100" },
    { label: "Teachers", href: `/list/teachers?classId=${classId}`, tone: "bg-indigo-50 text-indigo-700 border-indigo-100" },
    { label: "Exams", href: `/list/exams?classId=${classId}`, tone: "bg-rose-50 text-rose-700 border-rose-100" },
    { label: "Assignments", href: `/list/assignments?classId=${classId}`, tone: "bg-cyan-50 text-cyan-700 border-cyan-100" },
    { label: "Results", href: `/list/results?studentId=${student.id}`, tone: "bg-amber-50 text-amber-700 border-amber-100" },
  ];

  return (
    <div className="p-4 flex flex-col xl:flex-row gap-4 bg-[#F6F8FB] min-h-full">
      {/* LEFT */}
      <div className="w-full xl:w-2/3 flex flex-col gap-4">
        {/* TOP */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* PROFILE CARD */}
          <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex gap-4">
            <Image
              src={student.img || "/noAvatar.png"}
              alt=""
              width={112}
              height={112}
              className="w-28 h-28 rounded-full object-cover ring-4 ring-blue-50 shrink-0"
            />

            <div className="flex-1 min-w-0 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[9px] font-bold tracking-wider text-blue-600 bg-blue-50 border border-blue-100 rounded px-1.5 py-0.5">
                    STUDENT
                  </span>
                  <h1 className="text-lg font-bold text-gray-900 mt-1.5 truncate">
                    {student.name} {student.surname}
                  </h1>
                  <p className="text-[11px] text-gray-500">@{student.username}</p>
                </div>
                {role === "admin" && (
                  <FormContainer table="student" type="update" data={student} />
                )}
              </div>

              <div className="flex flex-wrap gap-1">
                <span className="text-[10px] font-medium text-blue-700 bg-blue-50 border border-blue-100 rounded px-1.5 py-0.5">
                  Class {student.class.name}
                </span>
                {student.grade && (
                  <span className="text-[10px] font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 rounded px-1.5 py-0.5">
                    Grade {student.grade.level}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                <InfoItem icon={<Droplets className="w-3.5 h-3.5" />}>
                  {student.bloodType || "-"}
                </InfoItem>
                <InfoItem icon={<CalendarDays className="w-3.5 h-3.5" />}>
                  {student.birthday.toLocaleDateString()}
                </InfoItem>
                <InfoItem icon={<Mail className="w-3.5 h-3.5" />}>
                  {student.email || "-"}
                </InfoItem>
                <InfoItem icon={<Phone className="w-3.5 h-3.5" />}>
                  {student.phone || "-"}
                </InfoItem>
              </div>
            </div>
          </div>

          {/* STAT CARDS */}
          <div className="flex-1 grid grid-cols-2 gap-4 content-start">
            <CardShell icon={<CalendarCheck className="w-5 h-5" />}>
              <Suspense
                fallback={<p className="text-xs text-gray-400">Loading...</p>}
              >
                <StudentAttendanceCard id={student.id} />
              </Suspense>
            </CardShell>
            <StatCard
              icon={<GraduationCap className="w-5 h-5" />}
              value={student.grade ? student.grade.level : "-"}
              label="Grade"
            />
            <StatCard
              icon={<Presentation className="w-5 h-5" />}
              value={student.class._count.lessons}
              label="Lessons"
            />
            <StatCard
              icon={<School className="w-5 h-5" />}
              value={student.class.name}
              label="Class"
            />
          </div>
        </div>

        {/* SCHEDULE */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 h-[720px] flex flex-col">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
            <CalendarDays className="w-4 h-4 text-blue-600" />
            Student&apos;s Schedule
          </h2>
          <div className="flex-1 min-h-0">
            <BigCalenderContainer type="classId" id={classId} />
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <h2 className="text-sm font-semibold text-gray-900">Shortcuts</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {shortcuts.map(({ label, href, tone }) => (
              <Link
                key={label}
                href={href}
                className={`text-[11px] font-medium border rounded-lg px-3 py-2 transition hover:opacity-80 ${tone}`}
              >
                Student&apos;s {label}
              </Link>
            ))}
          </div>
        </div>

        <Performance />

        <div className="min-h-[380px]">
          <Announcements />
        </div>
      </div>
    </div>
  );
};

export default SingleStudentPage;