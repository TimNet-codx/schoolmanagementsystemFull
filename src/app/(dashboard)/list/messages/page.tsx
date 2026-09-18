import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { Message, Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { getAuthUser } from "@/lib/utils";
import Image from "next/image";

type MessageList = Message;

const MessageListPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { role, currentUserId } = await getAuthUser();

  const columns = [
    {
      header: "Subject",
      accessor: "subject",
    },
    {
      header: "Content",
      accessor: "content",
      className: "hidden md:table-cell",
    },
    {
      header: "Sender",
      accessor: "senderId",
    },
    {
      header: "Receiver",
      accessor: "receiverId",
    },
    {
      header: "Date",
      accessor: "createdAt",
      className: "hidden md:table-cell",
    },
    ...(role === "admin"
      ? [
          {
            header: "Actions",
            accessor: "action",
          },
        ]
      : []),
  ];

  const { page, ...queryParams } = await searchParams;
  const pageNumber = page ? parseInt(page) : 1;

  const query: Prisma.MessageWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.OR = [
              { subject: { contains: value, mode: "insensitive" } },
              { content: { contains: value, mode: "insensitive" } },
            ];
            break;
          default:
            break;
        }
      }
    }
  }

  // Filter messages related to the logged-in user unless admin
  if (role !== "admin") {
    query.OR = [{ senderId: currentUserId! }, { receiverId: currentUserId! }];
  }

  const [data, count] = await prisma.$transaction([
    prisma.message.findMany({
      where: query,
      orderBy: { createdAt: "desc" },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (pageNumber - 1),
    }),
    prisma.message.count({ where: query }),
  ]);

  const renderRow = (item: MessageList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="p-4 font-semibold">{item.subject}</td>
      <td className="hidden md:table-cell p-4 truncate max-w-xs">
        {item.content}
      </td>
      <td className="p-4 font-semibold">{item.senderId}</td>
      <td className="p-4 font-semibold">{item.receiverId}</td>
      <td className="hidden md:table-cell p-4">
        {new Intl.DateTimeFormat("en-NG", {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(item.createdAt)}
      </td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          {item.senderId === currentUserId || role === "admin" ? (
            <>
              <FormContainer table="message" type="update" data={item} />
              <FormContainer table="message" type="delete" id={item.id} />
            </>
          ) : (
            <span className="text-xs text-gray-400">Received</span>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Messages</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C]">
              <Image src="/filter.png" alt="Filter" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C]">
              <Image src="/sort.png" alt="Sort" width={14} height={14} />
            </button>
            {/* <FormContainer table="message" type="create" /> */}
            {role === "admin" && (
              <FormContainer table="message" type="create" />
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={pageNumber} count={count} />
    </div>
  );
};

export default MessageListPage;
