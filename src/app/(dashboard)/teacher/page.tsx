// import Announcements from "@/components/Announcements";
// import BigCalendar from "@/components/BigCalender";
// import BigCalenderContainer from "@/components/BigCalenderContainer";
// import EventCalendarContainer from "@/components/EventCalendarContainer";
// import { auth } from "@clerk/nextjs/server";

// const TeacherPage = async ({
//   searchParams,
// }: {
//   searchParams: { [keys: string]: string | undefined };
// }) => {
//   const authData = await auth();
//   const { userId } = authData;
// //   const teacherId = userId ?? "";

//   return (
//     <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
//       {/* LEFT */}
//       <div className="w-full xl:w-2/3">
//         <div className="h-full bg-white p-4 rounded-md">
//           <h1 className="text-xl font-semibold">Schedule: </h1>
//           <BigCalenderContainer type="teacherId" id={userId!} />
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

// export default TeacherPage;



import Announcements from "@/components/Announcements";
import BigCalenderContainer from "@/components/BigCalenderContainer";
import EventCalendarContainer from "@/components/EventCalendarContainer";
import { auth } from "@clerk/nextjs/server";
import { CalendarDays } from "lucide-react";

const TeacherPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [keys: string]: string | undefined }>;
}) => {
  const { userId } = await auth();
  const resolvedSearchParams = await searchParams;

  return (
    <div className="p-4 flex flex-col gap-4 bg-[#F6F8FB] min-h-full">
      {/* HEADER */}
      <div>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-wide text-blue-600 bg-blue-50 border border-blue-100 rounded px-2 py-0.5 mb-2">
          TEACHER OVERVIEW
          <span className="text-gray-400 font-normal">• My Schedule</span>
        </span>
        <h1 className="text-2xl font-bold text-gray-900">Teaching Dashboard</h1>
        <p className="text-xs text-gray-500 mt-1 max-w-md">
          Your weekly timetable, upcoming events and campus announcements.
        </p>
      </div>

      <div className="flex gap-4 flex-col xl:flex-row">
        {/* LEFT: SCHEDULE */}
        <div className="w-full xl:w-2/3">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 h-[720px] flex flex-col">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
              <CalendarDays className="w-4 h-4 text-blue-600" />
              Weekly Schedule
            </h2>
            <div className="flex-1 min-h-0">
              {userId ? (
                <BigCalenderContainer type="teacherId" id={userId} />
              ) : (
                <p className="text-xs text-gray-400">
                  Sign in to see your schedule.
                </p>
              )}
            </div>
          </div>
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

export default TeacherPage;