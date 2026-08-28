import FormModal from "@/components/FromModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { Lesson, Teacher, Class, Subject, Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import Image from "next/image";
import { getAuthUser } from "@/lib/utils";

const {role } = await getAuthUser();
type LessonList = Lesson & {teacher: Teacher} & {class: Class} & {subject: Subject}

const columns = [
  {
    header: "Subject Name",
    accessor: "name",
  },
  {
    header: "Class",
    accessor: "class",
  },
  {
    header: "Teacher",
    accessor: "teacher",
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

const LessonListPage = async ({
  searchParams,
}:{
  searchParams: Promise<{[key: string] : string | undefined}>;
}) => {
  const {page, ...queryParams} = await searchParams;
  const pageNumber = page ? parseInt(page) : 1;

  const query: Prisma.LessonWhereInput = {};
  if(queryParams){
    for(const [key, value] of Object.entries(queryParams)){
      if(value !== undefined){
        switch(key){
          case "teacherId":
            query.teacherId = value;
            break;
          case "classId":
            query.classId = parseInt(value);
            break;
          case "search":
            query.OR = [
              {teacher: {name: {contains: value, mode: "insensitive"}}},
              {subject: {name: {contains: value, mode: "insensitive"}}}
            ]
            break;
            default:
            break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
   prisma.lesson.findMany({
    where: query,
    include: {
      teacher: {select: {name: true, surname: true}},
      class: {select: {name: true}},
      subject: {select: {name: true}}
    },
    take: ITEM_PER_PAGE,
    skip: ITEM_PER_PAGE * (pageNumber - 1)
   }),
   prisma.lesson.count({where: query})
  ]);

  const renderRow = (item: LessonList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.subject.name}</td>
      <td>{item.class.name}</td>
      <td className="hidden md:table-cell">{item.teacher.name + " " + item.teacher.surname}</td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormModal table="lesson" type="update" data={item} />
              <FormModal table="lesson" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Lessons</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C]">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C]">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && <FormModal table="lesson" type="create" />}
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

export default LessonListPage;
