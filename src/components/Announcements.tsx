// import prisma from "@/lib/prisma";
// import { auth } from "@clerk/nextjs/server";

// const Announcements = async () => {
//   const authData = await auth();
//   const { userId, sessionClaims } = authData;
//   const role = (sessionClaims?.metadata as { role?: string })?.role;

//   const roleConditions: Record<string, any> = {
//     teacher: { lessons: { some: { teacherId: userId } } },
//     student: { students: { some: { id: userId } } },
//     parent: { students: { some: { parentId: userId } } },
//   };

//   const where =
//     role === "admin" || !role
//       ? {}
//       : {
//           OR: [{ classId: null }, { class: roleConditions[role] ?? {} }],
//         };

//   const data = await prisma.announcement.findMany({
//     take: 6,
//     orderBy: { date: "desc" },
//     where,
//   });

//   return (
//     <div className="bg-white p-4 rounded-md">
//       <div className="flex items-center justify-between">
//         <h1 className="text-xl font-semibold">Announcements</h1>
//         <span className="text-xs text-gray-400">View All</span>
//       </div>
//       <div className="flex flex-col gap-4 mt-4">
//         {data[0] && (
//           <div className="bg-[#EDF9FD] rounded-md p-4">
//             <div className="flex items-center justify-between">
//               <h2 className="font-medium">{data[0].title}</h2>
//               <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
//                 {new Intl.DateTimeFormat("en-GB").format(data[0].date)}
//               </span>
//             </div>
//             <p className="text-sm text-gray-400 mt-1">{data[0].description}</p>
//           </div>
//         )}

//         {data[1] && (
//           <div className="bg-[#F1F0FF] rounded-md p-4">
//             <div className="flex items-center justify-between">
//               <h2 className="font-medium">{data[1].title}</h2>
//               <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
//                 {new Intl.DateTimeFormat("en-GB").format(data[1].date)}
//               </span>
//             </div>
//             <p className="text-sm text-gray-400 mt-1">{data[1].description}</p>
//           </div>
//         )}

//         {data[2] && (
//           <div className="bg-[#FEFCE8] rounded-md p-4">
//             <div className="flex items-center justify-between">
//               <h2 className="font-medium">{data[2].title}</h2>
//               <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
//                 {new Intl.DateTimeFormat("en-GB").format(data[2].date)}
//               </span>
//             </div>
//             <p className="text-sm text-gray-400 mt-1">{data[2].description}</p>
//           </div>
//         )}
//         {data[3] && (
//           <div className="bg-[#EDF9FD] rounded-md p-4">
//             <div className="flex items-center justify-between">
//               <h2 className="font-medium">{data[3].title}</h2>
//               <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
//                 {new Intl.DateTimeFormat("en-GB").format(data[3].date)}
//               </span>
//             </div>
//             <p className="text-sm text-gray-400 mt-1">{data[2].description}</p>
//           </div>
//         )}{data[4] && (
//           <div className="bg-[#FEFCE8] rounded-md p-4">
//             <div className="flex items-center justify-between">
//               <h2 className="font-medium">{data[4].title}</h2>
//               <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
//                 {new Intl.DateTimeFormat("en-GB").format(data[4].date)}
//               </span>
//             </div>
//             <p className="text-sm text-gray-400 mt-1">{data[4].description}</p>
//           </div>
//         )}
//         {data[5] && (
//           <div className="bg-[#FEFCE8] rounded-md p-4">
//             <div className="flex items-center justify-between">
//               <h2 className="font-medium">{data[5].title}</h2>
//               <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
//                 {new Intl.DateTimeFormat("en-GB").format(data[5].date)}
//               </span>
//             </div>
//             <p className="text-sm text-gray-400 mt-1">{data[5].description}</p>
//           </div>
//         )}
//          {data[6] && (
//           <div className="bg-[#F1F0FF] rounded-md p-4">
//             <div className="flex items-center justify-between">
//               <h2 className="font-medium">{data[6].title}</h2>
//               <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
//                 {new Intl.DateTimeFormat("en-GB").format(data[6].date)}
//               </span>
//             </div>
//             <p className="text-sm text-gray-400 mt-1">{data[6].description}</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Announcements;

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Megaphone } from "lucide-react";
import Link from "next/link";

const CARD_STYLES = [
  "bg-blue-50/60 border-blue-100",
  "bg-indigo-50/60 border-indigo-100",
  "bg-amber-50/60 border-amber-100",
  "bg-emerald-50/60 border-emerald-100",
];

const BADGE_STYLES = [
  "bg-blue-100 text-blue-700",
  "bg-indigo-100 text-indigo-700",
  "bg-amber-100 text-amber-700",
  "bg-emerald-100 text-emerald-700",
];

const Announcements = async () => {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const roleConditions: Record<string, any> = {
    teacher: { lessons: { some: { teacherId: userId } } },
    student: { students: { some: { id: userId } } },
    parent: { students: { some: { parentId: userId } } },
  };

  const where =
    role === "admin" || !role
      ? {}
      : {
          OR: [{ classId: null }, { class: roleConditions[role] ?? {} }],
        };

  const data = await prisma.announcement.findMany({
    take: 4,
    orderBy: { date: "desc" },
    where,
  });

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          <Megaphone className="w-4 h-4 text-blue-600" />
          Announcements
        </h1>
        <Link
          href="/list/announcements"
          className="text-[11px] font-medium text-blue-600 hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="flex flex-col gap-3 mt-4 overflow-auto">
        {data.length === 0 && (
          <p className="text-xs text-gray-400">No announcements yet.</p>
        )}

        {data.map((item, i) => (
          <div
            key={item.id}
            className={`rounded-lg border p-3 ${CARD_STYLES[i % CARD_STYLES.length]}`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span
                className={`text-[9px] font-bold tracking-wider rounded px-1.5 py-0.5 ${BADGE_STYLES[i % BADGE_STYLES.length]}`}
              >
                {item.classId ? "CLASS" : "GENERAL"}
              </span>
              <span className="text-[10px] text-gray-500">
                {new Intl.DateTimeFormat("en-GB").format(item.date)}
              </span>
            </div>
            <h2 className="text-xs font-semibold text-gray-900">
              {item.title}
            </h2>
            <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;
