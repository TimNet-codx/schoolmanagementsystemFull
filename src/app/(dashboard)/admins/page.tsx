import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { Admin, Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { getAuthUser } from "@/lib/utils";
import { Eye, ListFilter, ArrowUpDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type AdminList = Admin;

const AdminListPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { role } = await getAuthUser();

  const columns = [
    { header: "Admin", accessor: "info" },
    {
      header: "Admin ID",
      accessor: "teacherId",
      className: "hidden md:table-cell",
    },
    {
      header: "Username",
      accessor: "username",
      className: "hidden md:table-cell",
    },
    { header: "Phone", accessor: "phone", className: "hidden lg:table-cell" },
    {
      header: "Address",
      accessor: "address",
      className: "hidden lg:table-cell",
    },
    ...(role === "admin" ? [{ header: "Actions", accessor: "action" }] : []),
  ];

  const { page, ...queryParams } = await searchParams;
  const pageNumber = page ? parseInt(page) : 1;

  // URL params for filtering and searching
  const query: Prisma.AdminWhereInput = {};
  for (const [key, value] of Object.entries(queryParams)) {
    if (value === undefined) continue;
    switch (key) {
      case "search":
        query.username = { contains: value, mode: "insensitive" };
        break;
      default:
        break;
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.admin.findMany({
      where: query,
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (pageNumber - 1),
    }),
    prisma.admin.count({ where: query }),
  ]);

  const renderRow = (item: AdminList) => (
    <tr
      key={item.id}
      className="text-xs text-gray-700 hover:bg-blue-50/40 transition-colors"
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Image
            src={item.img || "/noAvatar.png"}
            alt=""
            width={36}
            height={36}
            className="hidden sm:block w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-sm"
          />
          <div className="flex flex-col min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {item.name} {item.surname}
            </h3>
            <p className="text-[11px] text-gray-500 truncate">{item.email}</p>
          </div>
        </div>
      </td>

      <td className="hidden md:table-cell px-4 py-3 text-gray-500">
        <span className="font-mono text-[11px]">{item.id}</span>
      </td>
      <td className="hidden md:table-cell px-4 py-3">{item.username}</td>

      <td className="hidden lg:table-cell px-4 py-3">{item.phone}</td>
      <td className="hidden lg:table-cell px-4 py-3 max-w-[200px] truncate">
        {item.address}
      </td>

      {role === "admin" && (
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <Link
              href={`/list/teachers/${item.id}`}
              aria-label="View teacher"
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
            >
              <Eye className="w-3.5 h-3.5" />
            </Link>
            <FormContainer table="admin" type="delete" id={item.id} />
          </div>
        </td>
      )}
    </tr>
  );

  return (
    <div className="p-4 bg-[#F6F8FB] min-h-full">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        {/* TOP */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-sm font-semibold text-gray-900">All Admins</h1>
            <p className="text-[11px] text-gray-500">
              {count.toLocaleString()} faculty member{count === 1 ? "" : "s"}
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 w-full md:w-auto">
            <TableSearch />
            <div className="flex items-center gap-2 self-end md:self-auto">
              <button
                type="button"
                aria-label="Filter"
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition"
              >
                <ListFilter className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                aria-label="Sort"
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
              </button>
              {role === "admin" && (
                <FormContainer table="admin" type="create" />
              )}
            </div>
          </div>
        </div>

        {/* LIST */}
        <Table columns={columns} renderRow={renderRow} data={data} />

        {/* PAGINATION */}
        <Pagination page={pageNumber} count={count} />
      </div>
    </div>
  );
};

export default AdminListPage;
