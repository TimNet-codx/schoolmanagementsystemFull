// import FormModal from "@/components/FromModal";
// import Pagination from "@/components/Pagination";
// import Table from "@/components/Table";
// import TableSearch from "@/components/TableSearch";
// import { Prisma, Subject, Teacher } from "@/generated/prisma/client";
// import prisma from "@/lib/prisma";
// import { ITEM_PER_PAGE } from "@/lib/settings";
// import Image from "next/image";
// import { getAuthUser } from "@/lib/utils";
// import FormContainer from "@/components/FormContainer";

// type SubjectList = Subject & { teachers: Teacher[] };

// const SubjectListPage = async ({
//   searchParams,
// }: {
//   searchParams: Promise<{ [key: string]: string | undefined }>;
// }) => {
//   const { role } = await getAuthUser();
//   const columns = [
//     {
//       header: "Subject Name",
//       accessor: "name",
//     },
//     {
//       header: "Teachers",
//       accessor: "teachers",
//       className: "hidden md:table-cell",
//     },
//     ...(role === "admin"
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

//   const query: Prisma.SubjectWhereInput = {};
//   if (queryParams) {
//     for (const [key, value] of Object.entries(queryParams)) {
//       if (value !== undefined) {
//         switch (key) {
//           case "search":
//             query.name = { contains: value, mode: "insensitive" };
//             break;
//           default:
//             break;
//         }
//       }
//     }
//   }

//   const [data, count] = await prisma.$transaction([
//     prisma.subject.findMany({
//       where: query,
//       include: {
//         teachers: true,
//         lessons: true,
//       },
//       take: ITEM_PER_PAGE,
//       skip: ITEM_PER_PAGE * (pageNumber - 1),
//     }),

//     prisma.subject.count({ where: query }),
//   ]);

//   const renderRow = (item: SubjectList) => (
//     <tr
//       key={item.id}
//       className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
//     >
//       <td className="flex items-center gap-4 p-4">{item.name}</td>
//       <td className="hidden md:table-cell">
//         {item.teachers.map((teacher) => teacher.name).join(",")}
//       </td>
//       <td>
//         <div className="flex items-center gap-2">
//           {role === "admin" && (
//             <>
//               <FormContainer table="subject" type="update" data={item} />
//               <FormContainer table="subject" type="delete" id={item.id} />
//             </>
//           )}
//         </div>
//       </td>
//     </tr>
//   );

//   return (
//     <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
//       {/* TOP */}
//       <div className="flex items-center justify-between">
//         <h1 className="hidden md:block text-lg font-semibold">All Subjects</h1>
//         <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
//           <TableSearch />
//           <div className="flex items-center gap-4 self-end">
//             <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C]">
//               <Image src="/filter.png" alt="" width={14} height={14} />
//             </button>
//             <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C]">
//               <Image src="/sort.png" alt="" width={14} height={14} />
//             </button>
//             {role === "admin" && <FormContainer table="subject" type="create" />}
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

// export default SubjectListPage;



import FormContainer from "@/components/FormContainer";
import ListCard from "@/components/ListCard";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import { Prisma, Subject, Teacher } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { getAuthUser } from "@/lib/utils";

type SubjectList = Subject & { teachers: Teacher[] };

const SubjectListPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { role } = await getAuthUser();
  const isAdmin = role === "admin";

  const columns = [
    { header: "Subject", accessor: "name" },
    { header: "Teachers", accessor: "teachers", className: "hidden md:table-cell" },
    ...(isAdmin ? [{ header: "Actions", accessor: "action" }] : []),
  ];

  const { page, ...queryParams } = await searchParams;
  const pageNumber = page ? parseInt(page) : 1;

  const query: Prisma.SubjectWhereInput = {};
  for (const [key, value] of Object.entries(queryParams)) {
    if (value === undefined) continue;
    switch (key) {
      case "teacherId":
        query.teachers = { some: { id: value } };
        break;
      case "search":
        query.name = { contains: value, mode: "insensitive" };
        break;
      default:
        break;
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.subject.findMany({
      where: query,
      include: { teachers: true }, // lessons were fetched but never used
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (pageNumber - 1),
    }),
    prisma.subject.count({ where: query }),
  ]);

  const renderRow = (item: SubjectList) => (
    <tr key={item.id} className="text-xs text-gray-700 hover:bg-blue-50/40 transition-colors">
      <td className="px-4 py-3 font-semibold text-gray-900">{item.name}</td>
      <td className="hidden md:table-cell px-4 py-3">
        <div className="flex flex-wrap gap-1">
          {item.teachers.length === 0 && <span className="text-gray-400">-</span>}
          {item.teachers.map((t) => (
            <span
              key={t.id}
              className="text-[10px] font-medium text-blue-700 bg-blue-50 border border-blue-100 rounded px-1.5 py-0.5"
            >
              {t.name} {t.surname}
            </span>
          ))}
        </div>
      </td>
      {isAdmin && (
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <FormContainer table="subject" type="update" data={item} />
            <FormContainer table="subject" type="delete" id={item.id} />
          </div>
        </td>
      )}
    </tr>
  );

  return (
    <ListCard
      title="All Subjects"
      subtitle={`${count.toLocaleString()} subject${count === 1 ? "" : "s"}`}
      action={isAdmin ? <FormContainer table="subject" type="create" /> : null}
    >
      <Table columns={columns} renderRow={renderRow} data={data} />
      <Pagination page={pageNumber} count={count} />
    </ListCard>
  );
};

export default SubjectListPage;