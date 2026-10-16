// import Image from "next/image";
// import "react-calendar/dist/Calendar.css";
// import EventList from "./EventList";
// import EventCalendar from "./EventCalendar";

// const EventCalendarContainer = async ({
//     searchParams,
// }: {
//     searchParams: {[keys: string]: string | undefined};
// }) => {
//    const {data} = searchParams;
//   return(
//      <div className="bg-white p-4 rounded-md">
//      <EventCalendar/>
//       <div className="flex items-center justify-between">
//         <h1 className="text-xl font-semibold my-4">Events</h1>
//         <Image src="/moreDark.png" alt="" width={20} height={20} />
//       </div>
//         <div className="flex flex-col gap-4"></div>
//          <EventList dateParam={data}/>
//       </div>

//   );
// };
// export default EventCalendarContainer;
import Image from "next/image";
import { Suspense } from "react";
import EventCalendar from "./EventCalendar";
import EventList from "./EventList";
import { CalendarDays } from "lucide-react";

const EventCalendarContainer = async ({
  searchParams,
}: {
  searchParams: { [keys: string]: string | undefined };
}) => {
  const { date } = searchParams;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 h-full">
      <Suspense fallback={null}>
        <EventCalendar />
      </Suspense>

      <div className="border-t border-gray-100 mt-4 pt-4">
        <h1 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          <CalendarDays className="w-4 h-4 text-blue-600" />
          Events
        </h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
        <div className="flex flex-col gap-3">
          <EventList dateParam={date} />
        </div>
      </div>
    </div>
  );
};

export default EventCalendarContainer;
