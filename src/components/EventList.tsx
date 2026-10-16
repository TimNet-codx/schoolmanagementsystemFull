// import prisma from "@/lib/prisma";

// const EventList =async ({dateParam}: {dateParam: string | undefined}) => {
//     const date = dateParam ? new Date(dateParam) : new Date();

//     const data = await prisma.event.findMany({
//             where:{
//                 startTime:{
//                     gte: new Date(date.setHours(0,0,0,0)),
//                     lte: new Date(date.setHours(23,59,59,999)),
//                 }
//             }
//     })
//     return data.map((event) => (
//             <div
//             className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-[#C3EBFA] even:border-t-[#CFCEFF]"
//             key={event.id}
//             >
//             <div className="flex items-center justify-between">
//                 <h1 className="font-semibold text-gray-600">{event.title}</h1>
//                 <span className="text-gray-300 text-xs">{event.startTime.toLocaleTimeString("en-NG",{
//                     hour: "2-digit",
//                     minute: "2-digit",
//                     hour12: false
//                 })}</span>
//             </div>
//             <p className="mt-2 text-gray-400 text-sm">{event.description}</p>
//             </div>

//     ));
// }

// export default EventList;

import prisma from "@/lib/prisma";

const BADGES = [
  "bg-blue-50 text-blue-700 border-blue-100",
  "bg-indigo-50 text-indigo-700 border-indigo-100",
  "bg-amber-50 text-amber-700 border-amber-100",
];

const EventList = async ({ dateParam }: { dateParam: string | undefined }) => {
  const base = dateParam ? new Date(dateParam) : new Date();

  // Avoid mutating one Date twice: build the day's bounds separately
  const start = new Date(base);
  start.setHours(0, 0, 0, 0);
  const end = new Date(base);
  end.setHours(23, 59, 59, 999);

  const data = await prisma.event.findMany({
    where: { startTime: { gte: start, lte: end } },
    orderBy: { startTime: "asc" },
  });

  if (data.length === 0) {
    return (
      <p className="text-xs text-gray-400 py-2">
        No events scheduled for this day.
      </p>
    );
  }

  return (
    <>
      {data.map((event, i) => {
        const time = event.startTime.toLocaleTimeString("en-NG", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
        const [clock, meridiem] = time.split(" ");

        return (
          <div
            key={event.id}
            className="flex gap-3 rounded-lg border border-gray-100 bg-gray-50/60 p-3"
          >
            {/* TIME */}
            <div className="flex flex-col items-center justify-center w-12 shrink-0 rounded-md bg-white border border-gray-100 py-1">
              <span className="text-[11px] font-bold text-gray-900 leading-none">
                {clock}
              </span>
              <span className="text-[9px] font-semibold text-gray-400 mt-0.5 uppercase">
                {meridiem}
              </span>
            </div>

            {/* DETAILS */}
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-xs font-semibold text-gray-900 truncate">
                  {event.title}
                </h2>
                <span
                  className={`text-[9px] font-bold tracking-wide border rounded px-1.5 py-0.5 shrink-0 ${BADGES[i % BADGES.length]}`}
                >
                  {event.classId ? "Class" : "School"}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2">
                {event.description}
              </p>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default EventList;
