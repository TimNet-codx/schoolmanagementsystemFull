// import Pagination from "@/components/Pagination";
// import Table from "@/components/Table";
// import TableSearch from "@/components/TableSearch";
// import { Parent, Prisma, Student } from "@/generated/prisma/client";
// import prisma from "@/lib/prisma";
// import { ITEM_PER_PAGE } from "@/lib/settings";
// import Image from "next/image";
// import { getAuthUser } from "@/lib/utils";
// import FormContainer from "@/components/FormContainer";

// type ParentList = Parent & { students: Student[] };

// const ParentListPage = async ({
//   searchParams,
// }: {
//   searchParams: Promise<{ [key: string]: string | undefined }>;
// }) => {
//   const { role } = await getAuthUser();
//   const columns = [
//     {
//       header: "Info",
//       accessor: "info",
//     },
//     {
//       header: "Parent ID",
//       accessor: "id",
//       className: "hidden md:table-cell",
//     },
//     {
//       header: "Parent Surname",
//       accessor: "surname",
//       className: "hidden md:table-cell",
//     },
//     {
//       header: "Username",
//       accessor: "username",
//       className: "hidden md:table-cell",
//     },
//     {
//       header: "Student Names",
//       accessor: "students",
//       className: "hidden md:table-cell",
//     },
//     {
//       header: "Phone",
//       accessor: "phone",
//       className: "hidden lg:table-cell",
//     },
//     {
//       header: "Address",
//       accessor: "address",
//       className: "hidden lg:table-cell",
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

//   const query: Prisma.ParentWhereInput = {};
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
//     prisma.parent.findMany({
//       where: query,
//       include: {
//         students: true,
//       },
//       take: ITEM_PER_PAGE,
//       skip: ITEM_PER_PAGE * (pageNumber - 1),
//     }),

//     prisma.parent.count({ where: query }),
//   ]);

//   const renderRow = (item: ParentList) => (
//     <tr
//       key={item.id}
//       className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
//     >
//       <td className="flex items-center gap-4 p-4">
//         <div className="flex flex-col">
//           <h3 className="font-semibold">{item.name}</h3>
//           <p className="text-xs text-gray-500">{item?.email}</p>
//         </div>
//       </td>
//       <td className="hidden md:table-cell">{item.id}</td>
//       <td className="hidden md:table-cell">{item.surname}</td>
//       <td className="hidden md:table-cell">{item.username}</td>
//       <td className="hidden md:table-cell">
//         {item.students.map((student) => student.name).join(", ")}
//       </td>
//       <td className="hidden md:table-cell">{item.phone}</td>
//       <td className="hidden md:table-cell">{item.address}</td>
//       <td>
//         <div className="flex items-center gap-2">
//           {role === "admin" && (
//             <>
//               <FormContainer table="parent" type="update" data={item} />
//               <FormContainer table="parent" type="delete" id={item.id} />
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
//         <h1 className="hidden md:block text-lg font-semibold">All Parents</h1>
//         <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
//           <TableSearch />
//           <div className="flex items-center gap-4 self-end">
//             <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C]">
//               <Image src="/filter.png" alt="" width={14} height={14} />
//             </button>
//             <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C]">
//               <Image src="/sort.png" alt="" width={14} height={14} />
//             </button>
//             {role === "admin" && <FormContainer table="parent" type="create" />}
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

// export default ParentListPage;


import FormContainer from "@/components/FormContainer";
import ListCard from "@/components/ListCard";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import { Parent, Prisma, Student } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { getAuthUser } from "@/lib/utils";

type ParentList = Parent & { students: Student[] };

const ParentListPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { role } = await getAuthUser();
  const isAdmin = role === "admin";

  const columns = [
    { header: "Parent", accessor: "info" },
    { header: "Parent ID", accessor: "id", className: "hidden md:table-cell" },
    { header: "Username", accessor: "username", className: "hidden md:table-cell" },
    { header: "Students", accessor: "students", className: "hidden md:table-cell" },
    { header: "Phone", accessor: "phone", className: "hidden lg:table-cell" },
    { header: "Address", accessor: "address", className: "hidden lg:table-cell" },
    ...(isAdmin ? [{ header: "Actions", accessor: "action" }] : []),
  ];

  const { page, ...queryParams } = await searchParams;
  const pageNumber = page ? parseInt(page) : 1;

  const query: Prisma.ParentWhereInput = {};
  for (const [key, value] of Object.entries(queryParams)) {
    if (value === undefined) continue;
    if (key === "search") {
      query.name = { contains: value, mode: "insensitive" };
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.parent.findMany({
      where: query,
      include: { students: true },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (pageNumber - 1),
    }),
    prisma.parent.count({ where: query }),
  ]);

  const renderRow = (item: ParentList) => (
    <tr key={item.id} className="text-xs text-gray-700 hover:bg-blue-50/40 transition-colors">
      <td className="px-4 py-3">
        <div className="flex flex-col min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">
            {item.name} {item.surname}
          </h3>
          <p className="text-[11px] text-gray-500 truncate">{item.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell px-4 py-3 text-gray-500">
        <span className="font-mono text-[11px]">{item.id}</span>
      </td>
      <td className="hidden md:table-cell px-4 py-3">{item.username}</td>
      <td className="hidden md:table-cell px-4 py-3">
        <div className="flex flex-wrap gap-1">
          {item.students.map((s) => (
            <span
              key={s.id}
              className="text-[10px] font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 rounded px-1.5 py-0.5"
            >
              {s.name} {s.surname}
            </span>
          ))}
        </div>
      </td>
      <td className="hidden lg:table-cell px-4 py-3">{item.phone}</td>
      <td className="hidden lg:table-cell px-4 py-3 max-w-[200px] truncate">
        {item.address}
      </td>
      {isAdmin && (
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <FormContainer table="parent" type="update" id={item.id} data={item} />
            <FormContainer table="parent" type="delete" id={item.id} />
          </div>
        </td>
      )}
    </tr>
  );

  return (
    <ListCard
      title="All Parents"
      subtitle={`${count.toLocaleString()} guardian${count === 1 ? "" : "s"}`}
      action={isAdmin ? <FormContainer table="parent" type="create" /> : null}
    >
      <Table columns={columns} renderRow={renderRow} data={data} />
      <Pagination page={pageNumber} count={count} />
    </ListCard>
  );
};

export default ParentListPage;