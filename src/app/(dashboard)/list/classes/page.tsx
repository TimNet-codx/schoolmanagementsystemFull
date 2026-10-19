// import Pagination from "@/components/Pagination";
// import Table from "@/components/Table";
// import TableSearch from "@/components/TableSearch";
// import { Class, Prisma, Teacher } from "@/generated/prisma/client";
// import prisma from "@/lib/prisma";
// import { ITEM_PER_PAGE } from "@/lib/settings";
// import Image from "next/image";
// import { getAuthUser } from "@/lib/utils";
// import FormContainer from "@/components/FormContainer";

// type ClassList = Class & { supervisor: Teacher };

// const ClassListPage = async ({
//   searchParams,
// }: {
//   searchParams: Promise<{ [key: string]: string | undefined }>;
// }) => {
//   const { role } = await getAuthUser();
//   const columns = [
//     {
//       header: "Class Name",
//       accessor: "name",
//     },
//     {
//       header: "Capacity",
//       accessor: "capacity",
//       className: "hidden md:table-cell",
//     },
//     {
//       header: "Grade",
//       accessor: "grade",
//       className: "hidden md:table-cell",
//     },
//     {
//       header: "Supervisor",
//       accessor: "supervisor",
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

//   const query: Prisma.ClassWhereInput = {};
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
//     prisma.class.findMany({
//       where: query,
//       include: {
//         supervisor: true,
//       },
//       take: ITEM_PER_PAGE,
//       skip: ITEM_PER_PAGE * (pageNumber - 1),
//     }),
//     prisma.class.count({ where: query }),
//   ]);

//   const renderRow = (item: ClassList) => (
//     <tr
//       key={item.id}
//       className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
//     >
//       <td className="flex items-center gap-4 p-4">{item.name}</td>
//       <td className="hidden md:table-cell">{item.capacity}</td>
//       <td className="hidden md:table-cell">{item.gradeId}</td>
//       <td className="hidden md:table-cell">
//         {item.supervisor.name + " " + item.supervisor.surname}
//       </td>
//       <td>
//         <div className="flex items-center gap-2">
//           {role === "admin" && (
//             <>
//               <FormContainer table="class" type="update" data={item} />
//               <FormContainer table="class" type="delete" id={item.id} />
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
//         <h1 className="hidden md:block text-lg font-semibold">All Classes</h1>
//         <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
//           <TableSearch />
//           <div className="flex items-center gap-4 self-end">
//             <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C]">
//               <Image src="/filter.png" alt="" width={14} height={14} />
//             </button>
//             <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C]">
//               <Image src="/sort.png" alt="" width={14} height={14} />
//             </button>
//             {role === "admin" && <FormContainer table="class" type="create" />}
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

// export default ClassListPage;



import FormContainer from "@/components/FormContainer";
import ListCard from "@/components/ListCard";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import { Class, Grade, Prisma, Teacher } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { getAuthUser } from "@/lib/utils";

type ClassList = Class & { supervisor: Teacher | null; grade: Grade | null };

const ClassListPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { role } = await getAuthUser();
  const isAdmin = role === "admin";

  const columns = [
    { header: "Class", accessor: "name" },
    { header: "Capacity", accessor: "capacity", className: "hidden md:table-cell" },
    { header: "Grade", accessor: "grade", className: "hidden md:table-cell" },
    { header: "Supervisor", accessor: "supervisor", className: "hidden md:table-cell" },
    ...(isAdmin ? [{ header: "Actions", accessor: "action" }] : []),
  ];

  const { page, ...queryParams } = await searchParams;
  const pageNumber = page ? parseInt(page) : 1;

  const query: Prisma.ClassWhereInput = {};
  for (const [key, value] of Object.entries(queryParams)) {
    if (value === undefined) continue;
    switch (key) {
      case "supervisorId":
        query.supervisorId = value;
        break;
      case "search":
        query.name = { contains: value, mode: "insensitive" };
        break;
      default:
        break;
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.class.findMany({
      where: query,
      include: { supervisor: true, grade: true },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (pageNumber - 1),
    }),
    prisma.class.count({ where: query }),
  ]);

  const renderRow = (item: ClassList) => (
    <tr key={item.id} className="text-xs text-gray-700 hover:bg-blue-50/40 transition-colors">
      <td className="px-4 py-3 font-semibold text-gray-900">{item.name}</td>
      <td className="hidden md:table-cell px-4 py-3">{item.capacity}</td>
      <td className="hidden md:table-cell px-4 py-3">
        <span className="text-[10px] font-medium text-blue-700 bg-blue-50 border border-blue-100 rounded px-1.5 py-0.5">
          {item.grade ? `Grade ${item.grade.level}` : "-"}
        </span>
      </td>
      <td className="hidden md:table-cell px-4 py-3">
        {item.supervisor
          ? `${item.supervisor.name} ${item.supervisor.surname}`
          : "-"}
      </td>
      {isAdmin && (
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <FormContainer table="class" type="update" data={item} />
            <FormContainer table="class" type="delete" id={item.id} />
          </div>
        </td>
      )}
    </tr>
  );

  return (
    <ListCard
      title="All Classes"
      subtitle={`${count.toLocaleString()} class${count === 1 ? "" : "es"}`}
      action={isAdmin ? <FormContainer table="class" type="create" /> : null}
    >
      <Table columns={columns} renderRow={renderRow} data={data} />
      <Pagination page={pageNumber} count={count} />
    </ListCard>
  );
};

export default ClassListPage;
