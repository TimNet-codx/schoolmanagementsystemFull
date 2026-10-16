// "use client";
// import Image from "next/image";
// import {BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,} from "recharts";

// // const data = [
// //   {
// //     name: "Mon",
// //     present: 60,
// //     absent: 40,
// //   },
// //   {
// //     name: "Tue",
// //     present: 70,
// //     absent: 60,
// //   },
// //   {
// //     name: "Wed",
// //     present: 90,
// //     absent: 75,
// //   },
// //   {
// //     name: "Thu",
// //     present: 90,
// //     absent: 75,
// //   },
// //   {
// //     name: "Fri",
// //     present: 65,
// //     absent: 55,
// //   },
// // ];

// const AttendanceChart = ({data}: {data: {name: string, present: number, absent: number}[]}) => {
//   return (
//       <ResponsiveContainer width="100%" height="90%">
//         <BarChart width={500} height={300} data={data} barSize={20}>
//           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
//           <XAxis
//             dataKey="name"
//             axisLine={false}
//             tick={{ fill: "#d1d5db" }}
//             tickLine={false}
//           />
//           <YAxis axisLine={false} tick={{ fill: "#d1d5db" }} tickLine={false} />
//           <Tooltip
//             contentStyle={{ borderRadius: "10px", borderColor: "lightgray" }}
//           />
//           <Legend
//             align="left"
//             verticalAlign="top"
//             wrapperStyle={{ paddingTop: "20px", paddingBottom: "40px" }}
//           />
//           <Bar
//             dataKey="present"
//             fill="#FAE27C"
//             legendType="circle"
//             radius={[10, 10, 0, 0]}
//           />
//           <Bar
//             dataKey="absent"
//             fill="#C3EBFA"
//             legendType="circle"
//             radius={[10, 10, 0, 0]}
//           />
//         </BarChart>
//       </ResponsiveContainer>
//   );
// };

// export default AttendanceChart;


"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Point = { name: string; present: number; absent: number };

const AttendanceChart = ({ data }: { data: Point[] }) => {
  const lastIndex = data.length - 1;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} barSize={44}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef0f4" />
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#6b7280", fontSize: 11 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#9ca3af", fontSize: 11 }}
          width={32}
        />
        <Tooltip
          cursor={{ fill: "#f3f6ff" }}
          contentStyle={{ borderRadius: 8, borderColor: "#e5e7eb", fontSize: 12 }}
        />
        <Bar dataKey="present" stackId="a" radius={[0, 0, 0, 0]} name="Present">
          {data.map((_, i) => (
            <Cell key={i} fill={i === lastIndex ? "#1e3a8a" : "#1d4ed8"} />
          ))}
        </Bar>
        <Bar
          dataKey="absent"
          stackId="a"
          fill="#bfdbfe"
          radius={[6, 6, 0, 0]}
          name="Absent / Excused"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default AttendanceChart;
