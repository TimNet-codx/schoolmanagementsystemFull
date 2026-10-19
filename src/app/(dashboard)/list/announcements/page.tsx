// import FormContainer from "@/components/FormContainer";
// import Pagination from "@/components/Pagination";
// import Table from "@/components/Table";
// import TableSearch from "@/components/TableSearch";
// import { Announcement, Class, Prisma } from "@/generated/prisma/client";
// import prisma from "@/lib/prisma";
// import { ITEM_PER_PAGE } from "@/lib/settings";
// import { getAuthUser } from "@/lib/utils";
// import Image from "next/image";

// // const { role, currentUserId } = await getAuthUser();
// type AnnouncementList = Announcement & { class: Class };

// const AnnouncementListPage = async ({
//   searchParams,
// }: {
//   searchParams: Promise<{ [key: string]: string | undefined }>;
// }) => {
//   const { role, currentUserId } = await getAuthUser();
//   const columns = [
//     {
//       header: "Title",
//       accessor: "title",
//     },
//       {
//       header: "Description",
//       accessor: "description",
//     },
//     {
//       header: "Class",
//       accessor: "class",
//     },
//     {
//       header: "Date",
//       accessor: "date",
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

//   const query: Prisma.AnnouncementWhereInput = {};
//   if (queryParams) {
//     for (const [key, value] of Object.entries(queryParams)) {
//       if (value !== undefined) {
//         switch (key) {
//           case "search":
//             query.title = { contains: value, mode: "insensitive" };
//             break;
//           default:
//             break;
//         }
//       }
//     }
//   }

//   // ROLE CONDITIONS to get data base on the role that login
//   if (role !== "admin") {
//     const roleConditions = {
//       teacher: { lessons: { some: { teacherId: currentUserId! } } },
//       student: { students: { some: { id: currentUserId! } } },
//       parent: { students: { some: { parentId: currentUserId! } } },
//     };

//     query.OR = [
//       { classId: null },
//       {
//         class: roleConditions[role as keyof typeof roleConditions] || {},
//       },
//     ];
//   }

//   const [data, count] = await prisma.$transaction([
//     prisma.announcement.findMany({
//       where: query,
//       include: {
//         class: true,
//       },
//       take: ITEM_PER_PAGE,
//       skip: ITEM_PER_PAGE * (pageNumber - 1),
//     }),
//     prisma.announcement.count({ where: query }),
//   ]);

//   const renderRow = (item: AnnouncementList) => (
//     <tr
//       key={item.id}
//       className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
//     >
//       <td className="flex items-center gap-4 p-4">{item.title}</td>
//        <td className="p-4 max-w-xs truncate">{item.description}</td>
//       {/* <td>{item.class?.name || "-"}</td>
//        */}
//        <td className="p-4">{item.class?.name || "All Classes"}</td>
//       <td className="hidden md:table-cell">
//         {new Intl.DateTimeFormat("en-NG").format(item.date)}
//       </td>
//       <td>
//         <div className="flex items-center gap-2">
//           {role === "admin" && (
//             <>
//               <FormContainer
//                 table="announcement"
//                 type="update"
//                 data={item}
//               />
//               <FormContainer table="announcement" type="delete" id={item.id} />
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
//         <h1 className="hidden md:block text-lg font-semibold">
//           All Announcements
//         </h1>
//         <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
//           <TableSearch />
//           <div className="flex items-center gap-4 self-end">
//             <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C]">
//               <Image src="/filter.png" alt="" width={14} height={14} />
//             </button>
//             <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C]">
//               <Image src="/sort.png" alt="" width={14} height={14} />
//             </button>
//             {/* {role === "admin" && (
//               <FormContainer table="announcement" type="create" />
//             )} */}
//             {role === "admin" && <FormContainer table="announcement" type="create" />}
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

// export default AnnouncementListPage;



import FormContainer from "@/components/FormContainer";
import ListCard from "@/components/ListCard";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import { Announcement, Class, Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { getAuthUser } from "@/lib/utils";

type AnnouncementList = Announcement & { class: Class | null };

const AnnouncementListPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { role, currentUserId } = await getAuthUser();
  const isAdmin = role === "admin";

  const columns = [
    { header: "Announcement", accessor: "title" },
    { header: "Description", accessor: "description", className: "hidden md:table-cell" },
    { header: "Audience", accessor: "class" },
    { header: "Date", accessor: "date", className: "hidden md:table-cell" },
    ...(isAdmin ? [{ header: "Actions", accessor: "action" }] : []),
  ];

  const { page, ...queryParams } = await searchParams;
  const pageNumber = page ? parseInt(page) : 1;

  const query: Prisma.AnnouncementWhereInput = {};
  for (const [key, value] of Object.entries(queryParams)) {
    if (value === undefined) continue;
    if (key === "search") {
      query.title = { contains: value, mode: "insensitive" };
    }
  }

  // Role scoping
  if (!isAdmin) {
    const roleConditions = {
      teacher: { lessons: { some: { teacherId: currentUserId! } } },
      student: { students: { some: { id: currentUserId! } } },
      parent: { students: { some: { parentId: currentUserId! } } },
    };

    query.OR = [
      { classId: null },
      { class: roleConditions[role as keyof typeof roleConditions] || {} },
    ];
  }

  const [data, count] = await prisma.$transaction([
    prisma.announcement.findMany({
      where: query,
      include: { class: true },
      orderBy: { date: "desc" },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (pageNumber - 1),
    }),
    prisma.announcement.count({ where: query }),
  ]);

  const renderRow = (item: AnnouncementList) => (
    <tr key={item.id} className="text-xs text-gray-700 hover:bg-blue-50/40 transition-colors">
      <td className="px-4 py-3 font-semibold text-gray-900">{item.title}</td>
      <td className="hidden md:table-cell px-4 py-3 max-w-xs truncate text-gray-500">
        {item.description}
      </td>
      <td className="px-4 py-3">
        <span
          className={`text-[10px] font-medium border rounded px-1.5 py-0.5 ${
            item.class
              ? "text-indigo-700 bg-indigo-50 border-indigo-100"
              : "text-emerald-700 bg-emerald-50 border-emerald-100"
          }`}
        >
          {item.class?.name || "All Classes"}
        </span>
      </td>
      <td className="hidden md:table-cell px-4 py-3 text-gray-500">
        {new Intl.DateTimeFormat("en-NG").format(item.date)}
      </td>
      {isAdmin && (
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <FormContainer table="announcement" type="update" data={item} />
            <FormContainer table="announcement" type="delete" id={item.id} />
          </div>
        </td>
      )}
    </tr>
  );

  return (
    <ListCard
      title="All Announcements"
      subtitle={`${count.toLocaleString()} announcement${count === 1 ? "" : "s"}`}
      action={isAdmin ? <FormContainer table="announcement" type="create" /> : null}
    >
      <Table columns={columns} renderRow={renderRow} data={data} />
      <Pagination page={pageNumber} count={count} />
    </ListCard>
  );
};

export default AnnouncementListPage;
