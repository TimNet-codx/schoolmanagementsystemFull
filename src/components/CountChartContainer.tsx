// import {
//   RadialBarChart,
//   RadialBar,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import Image from "next/image";
// import CountChart from "./CountChart";
// import prisma from "@/lib/prisma";

// const CountChartContainer = async () => {
//   const data = await prisma.student.groupBy({
//     by: ["sex"],
//     _count: true,
//   });
//   //   console.log(data);
//   const boys = data.find((g) => g.sex === "MALE")?._count || 0;
//   const girls = data.find((g) => g.sex === "FEMALE")?._count || 0;
//   return (
//     <div className="bg-white rounded-xl w-full h-full p-4">
//       {/* TITLE */}
//       <div className="flex justify-between items-center">
//         <h1 className="text-lg font-semibold">Students</h1>
//         <Image src="/moreDark.png" alt="" width={20} height={20} />
//       </div>
//       {/* CHART */}
//       <CountChart boys={boys} girls={girls} />
//       {/* BOTTOM */}
//       <div className="flex justify-center gap-16">
//         <div className="flex flex-col gap-1">
//           <div className="w-5 h-5 bg-[#C3EBFA] rounded-full" />
//           <h1 className="font-bold">{boys}</h1>
//           <h2 className="text-xs text-gray-300">
//             Boys ({Math.round((boys / (boys + girls)) * 100)}%)
//           </h2>
//         </div>
//         <div className="flex flex-col gap-1">
//           <div className="w-5 h-5 bg-[#FAE27C] rounded-full" />
//           <h1 className="font-bold">{girls}</h1>
//           <h2 className="text-xs text-gray-300">
//             Girls ({Math.round((girls / (girls + boys)) * 100)}%)
//           </h2>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CountChartContainer;

import prisma from "@/lib/prisma";
import CountChart from "./CountChart";

const CountChartContainer = async () => {
  const data = await prisma.student.groupBy({
    by: ["sex"],
    _count: true,
  });

  const boys = data.find((g) => g.sex === "MALE")?._count || 0;
  const girls = data.find((g) => g.sex === "FEMALE")?._count || 0;
  const total = boys + girls;
  const pct = (n: number) => (total ? Math.round((n / total) * 100) : 0);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 w-full h-full flex flex-col">
      <div>
        <h1 className="text-sm font-semibold text-gray-900">
          Student Demographics
        </h1>
        <p className="text-[11px] text-gray-500">
          Gender distribution and headcount
        </p>
      </div>

      <div className="my-3">
        <CountChart boys={boys} girls={girls} />
      </div>

      <div className="flex flex-col gap-2 mt-auto text-xs">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-gray-600">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-700" />
            Male Students
          </span>
          <span className="font-semibold text-gray-900">
            {boys.toLocaleString()}{" "}
            <span className="text-gray-400 font-normal">({pct(boys)}%)</span>
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-gray-600">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-300" />
            Female Students
          </span>
          <span className="font-semibold text-gray-900">
            {girls.toLocaleString()}{" "}
            <span className="text-gray-400 font-normal">({pct(girls)}%)</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default CountChartContainer;
