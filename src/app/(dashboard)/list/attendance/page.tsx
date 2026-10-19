// import FormContainer from "@/components/FormContainer";
// import Pagination from "@/components/Pagination";
// import Table from "@/components/Table";
// import TableSearch from "@/components/TableSearch";
// import { Attendance, Student, Lesson, Prisma } from "@/generated/prisma/client";
// import prisma from "@/lib/prisma";
// import { ITEM_PER_PAGE } from "@/lib/settings";
// import { getAuthUser } from "@/lib/utils";
// import Image from "next/image";

// type AttendanceList = Attendance & {
//   student: Student;
//   lesson: Lesson;
// };

// const AttendanceListPage = async ({
//   searchParams,
// }: {
//   searchParams: Promise<{ [key: string]: string | undefined }>;
// }) => {
//   const { role, currentUserId } = await getAuthUser();

//   const columns = [
//     {
//       header: "Student",
//       accessor: "student",
//     },
//     {
//       header: "Lesson",
//       accessor: "lesson",
//     },
//     {
//       header: "Status",
//       accessor: "status",
//     },
//     {
//       header: "Date",
//       accessor: "date",
//       className: "hidden md:table-cell",
//     },
//     ...(role === "admin" || role === "teacher"
//       ? [
//           {
//             header: "Actions",
//             accessor: "action",
//           },
//         ]
//       : []),
//   ];

//   const { page, ...queryParams } = await searchParams;
//   const pageNumber = page ? parseInt(page) : 1;

//   const query: Prisma.AttendanceWhereInput = {};

//   if (queryParams) {
//     for (const [key, value] of Object.entries(queryParams)) {
//       if (value !== undefined) {
//         switch (key) {
//           case "search":
//             query.student = {
//               name: { contains: value, mode: "insensitive" },
//             };
//             break;
//           default:
//             break;
//         }
//       }
//     }
//   }

//   // ROLE CONDITIONS
//   if (role !== "admin") {
//     switch (role) {
//       case "teacher":
//         query.lesson = { teacherId: currentUserId! };
//         break;
//       case "student":
//         query.studentId = currentUserId!;
//         break;
//       case "parent":
//         query.student = { parentId: currentUserId! };
//         break;
//       default:
//         break;
//     }
//   }

//   const [data, count] = await prisma.$transaction([
//     prisma.attendance.findMany({
//       where: query,
//       include: {
//         student: { select: { id: true, name: true, surname: true } },
//         lesson: { select: { id: true, name: true } },
//       },
//       take: ITEM_PER_PAGE,
//       skip: ITEM_PER_PAGE * (pageNumber - 1),
//     }),
//     prisma.attendance.count({ where: query }),
//   ]);

//   const renderRow = (item: AttendanceList) => (
//     <tr
//       key={item.id}
//       className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
//     >
//       <td className="p-4 font-semibold">
//         {item.student.name} {item.student.surname}
//       </td>
//       <td className="p-4">{item.lesson.name}</td>
//       <td className="p-4">
//         <span
//           className={`px-2 py-1 rounded-md text-xs font-medium ${
//             item.present
//               ? "bg-green-100 text-green-700"
//               : "bg-red-100 text-red-700"
//           }`}
//         >
//           {item.present ? "Present" : "Absent"}
//         </span>
//       </td>
//       <td className="hidden md:table-cell p-4">
//         {new Intl.DateTimeFormat("en-NG").format(item.date)}
//       </td>
//       {(role === "admin" || role === "teacher") && (
//         <td className="p-4">
//           <div className="flex items-center gap-2">
//             <FormContainer table="attendance" type="update" data={item} />
//             <FormContainer table="attendance" type="delete" id={item.id} />
//           </div>
//         </td>
//       )}
//     </tr>
//   );

//   return (
//     <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
//       {/* TOP */}
//       <div className="flex items-center justify-between">
//         <h1 className="hidden md:block text-lg font-semibold">
//           Attendance Records
//         </h1>
//         <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
//           <TableSearch />
//           <div className="flex items-center gap-4 self-end">
//             <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C]">
//               <Image src="/filter.png" alt="Filter" width={14} height={14} />
//             </button>
//             <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C]">
//               <Image src="/sort.png" alt="Sort" width={14} height={14} />
//             </button>
//             {(role === "admin" || role === "teacher") && (
//               <FormContainer table="attendance" type="create" />
//             )}
//           </div>
//         </div>
//       </div>
//       {/* LIST */}
//       <Table columns={columns} renderRow={renderRow} data={data} />
//       {/* PAGINATION */}
//       <Pagination page={pageNumber} count={count} />
//     </div>
//   );
// };

// export default AttendanceListPage;



import FormContainer from "@/components/FormContainer";
import ListCard from "@/components/ListCard";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import { Attendance, Lesson, Prisma, Student } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { getAuthUser } from "@/lib/utils";

type AttendanceList = Attendance & { student: Student; lesson: Lesson };

const AttendanceListPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { role, currentUserId } = await getAuthUser();
  const canManage = role === "admin" || role === "teacher";

  const columns = [
    { header: "Student", accessor: "student" },
    { header: "Lesson", accessor: "lesson" },
    { header: "Status", accessor: "status" },
    { header: "Date", accessor: "date", className: "hidden md:table-cell" },
    ...(canManage ? [{ header: "Actions", accessor: "action" }] : []),
  ];

  const { page, ...queryParams } = await searchParams;
  const pageNumber = page ? parseInt(page) : 1;

  // AND-combine so URL search and role scoping don't overwrite each other
  // (parents' `student` filter used to replace the search filter)
  const filters: Prisma.AttendanceWhereInput[] = [];

  for (const [key, value] of Object.entries(queryParams)) {
    if (value === undefined) continue;
    if (key === "search") {
      filters.push({
        student: { name: { contains: value, mode: "insensitive" } },
      });
    }
  }

  switch (role) {
    case "teacher":
      filters.push({ lesson: { teacherId: currentUserId! } });
      break;
    case "student":
      filters.push({ studentId: currentUserId! });
      break;
    case "parent":
      filters.push({ student: { parentId: currentUserId! } });
      break;
    default:
      break;
  }

  const query: Prisma.AttendanceWhereInput = { AND: filters };

  const [data, count] = await prisma.$transaction([
    prisma.attendance.findMany({
      where: query,
      include: {
        student: { select: { id: true, name: true, surname: true } },
        lesson: { select: { id: true, name: true } },
      },
      orderBy: { date: "desc" },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (pageNumber - 1),
    }),
    prisma.attendance.count({ where: query }),
  ]);

  const renderRow = (item: AttendanceList) => (
    <tr key={item.id} className="text-xs text-gray-700 hover:bg-blue-50/40 transition-colors">
      <td className="px-4 py-3 font-semibold text-gray-900">
        {item.student.name} {item.student.surname}
      </td>
      <td className="px-4 py-3">{item.lesson.name}</td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center gap-1.5 text-[10px] font-semibold border rounded px-2 py-0.5 ${
            item.present
              ? "text-emerald-700 bg-emerald-50 border-emerald-100"
              : "text-red-700 bg-red-50 border-red-100"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              item.present ? "bg-emerald-500" : "bg-red-500"
            }`}
          />
          {item.present ? "Present" : "Absent"}
        </span>
      </td>
      <td className="hidden md:table-cell px-4 py-3 text-gray-500">
        {new Intl.DateTimeFormat("en-NG").format(item.date)}
      </td>
      {canManage && (
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <FormContainer table="attendance" type="update" data={item} />
            <FormContainer table="attendance" type="delete" id={item.id} />
          </div>
        </td>
      )}
    </tr>
  );

  return (
    <ListCard
      title="Attendance Records"
      subtitle={`${count.toLocaleString()} record${count === 1 ? "" : "s"}`}
      action={canManage ? <FormContainer table="attendance" type="create" /> : null}
    >
      <Table columns={columns} renderRow={renderRow} data={data} />
      <Pagination page={pageNumber} count={count} />
    </ListCard>
  );
};

export default AttendanceListPage;