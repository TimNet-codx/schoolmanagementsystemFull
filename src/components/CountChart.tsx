// "use client";
// import {RadialBarChart, RadialBar, Legend, ResponsiveContainer} from "recharts";
// import Image from "next/image";



// const CountChart = ({boys, girls}: {boys: number; girls: number}) => {const data = [
//   {
//     name: "Total",
//     count: boys+girls,
//     fill: "white",
//   },
//   {
//     name: "Girls",
//     count: girls,
//     fill: "#FAE27C",
//   },
//   {
//     name: "Boys",
//     count: boys,
//     fill: "#C3EBFA",
//   },
// ];
//    return (
//         <div className="relative w-full h-[75%]">
//             <ResponsiveContainer>
//                 <RadialBarChart cx="50%" cy="50%" innerRadius="40%" outerRadius="100%" barSize={32} data={data}>
//                     <RadialBar background dataKey="count" />
//                 </RadialBarChart>
//             </ResponsiveContainer>
//             <Image src="/maleFemale.png" alt="" width={50} height={50} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

//               {/* BOTTOM */}
//               {/* <div className="flex justify-center gap-16">
//                 <div className="flex flex-col gap-1">
//                     <div className="w-5 h-5 bg-[#C3EBFA] rounded-full" />
//                      <h1 className="font-bold">1,234</h1>
//                      <h2 className="text-xs text-gray-300">Boys (55%)</h2>

//                 </div>
//                 <div className="flex flex-col gap-1">
//                     <div className="w-5 h-5 bg-[#FAE27C] rounded-full" />
//                      <h1 className="font-bold">1,133</h1>
//                      <h2 className="text-xs text-gray-300">Girls (45%)</h2>
//                 </div>
    
//               </div> */}
//         </div>

//    )
// }

// export default CountChart; 


"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const CountChart = ({ boys, girls }: { boys: number; girls: number }) => {
  const total = boys + girls;
  const data =
    total === 0
      ? [{ name: "None", value: 1, fill: "#e5e7eb" }]
      : [
          { name: "Male", value: boys, fill: "#1d4ed8" },
          { name: "Female", value: girls, fill: "#93c5fd" },
        ];

  return (
    <div className="relative w-full h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={62}
            outerRadius={84}
            paddingAngle={total === 0 ? 0 : 3}
            stroke="none"
          >
            {data.map((d, i) => (
              <Cell key={i} fill={d.fill} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-2xl font-bold text-gray-900">
          {total.toLocaleString()}
        </span>
        <span className="text-[9px] font-semibold tracking-wider text-gray-400">
          STUDENTS
        </span>
      </div>
    </div>
  );
};

export default CountChart;