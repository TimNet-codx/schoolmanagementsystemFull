// import Announcements from "@/components/Announcements";
// import BigCalenderContainer from "@/components/BigCalenderContainer";
// import EventCalendarContainer from "@/components/EventCalendarContainer";
// import prisma from "@/lib/prisma";
// import { auth } from "@clerk/nextjs/server";

// const ParentPage = async ({
//   searchParams,
// }: {
//   searchParams: { [keys: string]: string | undefined };
// }) => {
//   const authData = await auth();
//   const { userId } = authData;

//   const classItem = await prisma.class.findMany({
//     where: {
//       students: { some: { id: userId! } },
//     },
//   });
//   return (
//     <div className="p-4 flex gap-4 flex-col xl:flex-row">
//       {/* LEFT */}
//       <div className="w-full xl:w-2/3">
//         <div className="h-full bg-white p-4 rounded-md">
//           <h1 className="text-xl font-semibold">Schedule (Ayo Mark)</h1>
//           {/* <BigCalenderContainer type="classId" id={classItem[0].id} /> */}
//           {classItem && classItem.length > 0 ? (
//             <BigCalenderContainer type="classId" id={classItem[0].id} />
//           ) : (
//             <p className="text-gray-500 mt-4">No schedule or class found.</p>
//           )}
//         </div>
//       </div>
//       {/* RIGHT */}
//       <div className="w-full xl:w-1/3 flex flex-col gap-8">
//         <EventCalendarContainer searchParams={searchParams} />
//         <Announcements />
//       </div>
//     </div>
//   );
// };

// export default ParentPage;

import Announcements from "@/components/Announcements";
import BigCalenderContainer from "@/components/BigCalenderContainer";
import EventCalendarContainer from "@/components/EventCalendarContainer";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { CalendarDays } from "lucide-react";

const ParentPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [keys: string]: string | undefined }>;
}) => {
  const { userId } = await auth();
  const resolvedSearchParams = await searchParams;

  // Children of the logged-in parent, with their class
  const children = userId
    ? await prisma.student.findMany({
        where: { parentId: userId },
        select: {
          id: true,
          name: true,
          surname: true,
          class: { select: { id: true, name: true } },
        },
      })
    : [];

  return (
    <div className="p-4 flex flex-col gap-4 bg-[#F6F8FB] min-h-full">
      {/* HEADER */}
      <div>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-wide text-blue-600 bg-blue-50 border border-blue-100 rounded px-2 py-0.5 mb-2">
          PARENT OVERVIEW
          <span className="text-gray-400 font-normal">• Family Portal</span>
        </span>
        <h1 className="text-2xl font-bold text-gray-900">Family Dashboard</h1>
        <p className="text-xs text-gray-500 mt-1 max-w-md">
          Follow your children&apos;s class schedules, school events and
          announcements.
        </p>
      </div>

      <div className="flex gap-4 flex-col xl:flex-row">
        {/* LEFT: SCHEDULES */}
        <div className="w-full xl:w-2/3 flex flex-col gap-4">
          {children.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <p className="text-xs text-gray-400">
                No students are linked to your account yet.
              </p>
            </div>
          )}

          {children.map((child) => (
            <div
              key={child.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 h-[720px] flex flex-col"
            >
              <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                <CalendarDays className="w-4 h-4 text-blue-600" />
                Schedule — {child.name} {child.surname}
                {child.class && (
                  <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-100 rounded px-1.5 py-0.5">
                    {child.class.name}
                  </span>
                )}
              </h2>

              <div className="flex-1 min-h-0">
                {child.class ? (
                  <BigCalenderContainer type="classId" id={child.class.id} />
                ) : (
                  <p className="text-xs text-gray-400">
                    No schedule or class found.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT */}
        <div className="w-full xl:w-1/3 flex flex-col gap-4">
          <EventCalendarContainer searchParams={resolvedSearchParams} />
          <div className="min-h-[380px]">
            <Announcements />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentPage;
