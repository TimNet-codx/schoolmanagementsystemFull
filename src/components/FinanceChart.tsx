// // "use client";

// // import Image from "next/image";
// // import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,} from "recharts";

// // const data = [
// //   {
// //     name: "Jan",
// //     income: 4000,
// //     expense: 2400,
// //   },
// //   {
// //     name: "Feb",
// //     income: 3000,
// //     expense: 1398,
// //   },
// //   {
// //     name: "Mar",
// //     income: 2000,
// //     expense: 9800,
// //   },
// //   {
// //     name: "Apr",
// //     income: 2780,
// //     expense: 3908,
// //   },
// //   {
// //     name: "May",
// //     income: 1890,
// //     expense: 4800,
// //   },
// //   {
// //     name: "Jun",
// //     income: 2390,
// //     expense: 3800,
// //   },
// //   {
// //     name: "Jul",
// //     income: 3490,
// //     expense: 4300,
// //   },
// //   {
// //     name: "Aug",
// //     income: 3490,
// //     expense: 4300,
// //   },
// //   {
// //     name: "Sep",
// //     income: 3490,
// //     expense: 4300,
// //   },
// //   {
// //     name: "Oct",
// //     income: 3490,
// //     expense: 4300,
// //   },
// //   {
// //     name: "Nov",
// //     income: 3490,
// //     expense: 4300,
// //   },
// //   {
// //     name: "Dec",
// //     income: 3490,
// //     expense: 4300,
// //   },
// // ];

// // const FinanceChart = () => {
// //   return (
// //     <div className="bg-white rounded-xl w-full h-full p-4">
// //       <div className="flex justify-between items-center">
// //         <h1 className="text-lg font-semibold">Finance</h1>
// //         <Image src="/moreDark.png" alt="" width={20} height={20} />
// //       </div>
// //       <ResponsiveContainer width="100%" height="90%">
// //         <LineChart
// //           width={500}
// //           height={300}
// //           data={data}
// //           margin={{
// //             top: 5,
// //             right: 30,
// //             left: 20,
// //             bottom: 5,
// //           }}
// //         >
// //           <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
// //           <XAxis
// //             dataKey="name"
// //             axisLine={false}
// //             tick={{ fill: "#d1d5db" }}
// //             tickLine={false}
// //             tickMargin={10}
// //           />
// //           <YAxis axisLine={false} tick={{ fill: "#d1d5db" }} tickLine={false}  tickMargin={20}/>
// //           <Tooltip />
// //           <Legend
// //             align="center"
// //             verticalAlign="top"
// //             wrapperStyle={{ paddingTop: "10px", paddingBottom: "30px" }}
// //           />
// //           <Line
// //             type="monotone"
// //             dataKey="income"
// //             stroke="#C3EBFA"
// //             strokeWidth={5}
// //           />
// //           <Line type="monotone" dataKey="expense" stroke="#CFCEFF" strokeWidth={5}/>
// //         </LineChart>
// //       </ResponsiveContainer>
// //     </div>
// //   );
// // };

// // export default FinanceChart;

// "use client";

// import {
//   Area,
//   AreaChart,
//   CartesianGrid,
//   ResponsiveContainer,
//   Tooltip,
//   XAxis,
//   YAxis,
// } from "recharts";

// // TODO: replace with real data from your database / finance API
// const SUMMARY = {
//   collected: 1238400,
//   budget: 1290000,
//   overdueInvoices: 48200,
//   overdueFamilies: 12,
//   paymentPlans: 18,
// };

// const data = [
//   { name: "Jan", income: 4000, expense: 2400 },
//   { name: "Feb", income: 3000, expense: 1398 },
//   { name: "Mar", income: 2000, expense: 9800 },
//   { name: "Apr", income: 2780, expense: 3908 },
//   { name: "May", income: 1890, expense: 4800 },
//   { name: "Jun", income: 2390, expense: 3800 },
//   { name: "Jul", income: 3490, expense: 4300 },
//   { name: "Aug", income: 3490, expense: 4300 },
//   { name: "Sep", income: 3490, expense: 4300 },
//   { name: "Oct", income: 3490, expense: 4300 },
//   { name: "Nov", income: 3490, expense: 4300 },
//   { name: "Dec", income: 3490, expense: 4300 },
// ];

// const money = (n: number) => `₦${n.toLocaleString("en-NG")}`;

// const FinanceChart = () => {
//   const rate = (SUMMARY.collected / SUMMARY.budget) * 100;

//   return (
//     <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 w-full h-full flex flex-col">
//       <div className="flex items-start justify-between">
//         <div>
//           <h1 className="text-sm font-semibold text-gray-900">
//             Term Tuition &amp; Finance
//           </h1>
//           <p className="text-[11px] text-gray-500">
//             Spring term collections and outstanding balances
//           </p>
//         </div>
//         <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 rounded px-2 py-0.5">
//           FY 24-26
//         </span>
//       </div>

//       <div className="flex items-end justify-between mt-4">
//         <div>
//           <p className="text-[9px] font-semibold tracking-wider text-gray-400">
//             COLLECTED TO DATE
//           </p>
//           <p className="text-2xl font-bold text-gray-900">
//             {money(SUMMARY.collected)}
//           </p>
//         </div>
//         <div className="text-right">
//           <p className="text-[9px] font-semibold tracking-wider text-gray-400">
//             TUITION BUDGET
//           </p>
//           <p className="text-sm font-semibold text-gray-600">
//             {money(SUMMARY.budget)}
//           </p>
//         </div>
//       </div>

//       <div className="mt-3">
//         <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1">
//           <span>Progress Rate</span>
//           <span className="font-semibold text-blue-700">
//             {rate.toFixed(1)}% Collected
//           </span>
//         </div>
//         <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
//           <div
//             className="h-full bg-blue-700 rounded-full"
//             style={{ width: `${rate}%` }}
//           />
//         </div>
//       </div>

//       <div className="flex-1 min-h-[120px] mt-4">
//         <ResponsiveContainer width="100%" height="100%">
//           <AreaChart
//             data={data}
//             margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
//           >
//             <defs>
//               <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="0%" stopColor="#1d4ed8" stopOpacity={0.25} />
//                 <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0} />
//               </linearGradient>
//             </defs>
//             <CartesianGrid
//               strokeDasharray="3 3"
//               vertical={false}
//               stroke="#eef0f4"
//             />
//             <XAxis
//               dataKey="name"
//               axisLine={false}
//               tickLine={false}
//               tick={{ fill: "#9ca3af", fontSize: 10 }}
//             />
//             <YAxis
//               axisLine={false}
//               tickLine={false}
//               tick={{ fill: "#9ca3af", fontSize: 10 }}
//             />
//             <Tooltip
//               contentStyle={{
//                 borderRadius: 8,
//                 borderColor: "#e5e7eb",
//                 fontSize: 12,
//               }}
//             />
//             <Area
//               type="monotone"
//               dataKey="income"
//               stroke="#1d4ed8"
//               strokeWidth={2}
//               fill="url(#income)"
//             />
//             <Area
//               type="monotone"
//               dataKey="expense"
//               stroke="#93c5fd"
//               strokeWidth={2}
//               fill="transparent"
//             />
//           </AreaChart>
//         </ResponsiveContainer>
//       </div>

//       <div className="flex flex-col gap-1.5 mt-3 text-[11px] border-t border-gray-100 pt-3">
//         <div className="flex items-center justify-between">
//           <span className="flex items-center gap-2 text-gray-600">
//             <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
//             Overdue Invoices
//           </span>
//           <span className="font-semibold text-red-600">
//             {money(SUMMARY.overdueInvoices)}{" "}
//             <span className="text-gray-400 font-normal">
//               ({SUMMARY.overdueFamilies} families)
//             </span>
//           </span>
//         </div>
//         <div className="flex items-center justify-between">
//           <span className="flex items-center gap-2 text-gray-600">
//             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
//             Payment Plans Active
//           </span>
//           <span className="font-semibold text-gray-900">
//             {SUMMARY.paymentPlans} accounts
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FinanceChart;

"use client";

import Link from "next/link";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Props = {
  session: string;
  collected: number;
  budget: number;
  outstanding: number;
  outstandingAccounts: number;
  paymentPlans: number;
  data: { name: string; income: number }[];
};

const money = (n: number) => `₦${Math.round(n).toLocaleString("en-NG")}`;

const compact = (n: number) =>
  n >= 1_000_000
    ? `₦${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`
    : n >= 1_000
    ? `₦${Math.round(n / 1_000)}k`
    : `₦${n}`;

const FinanceChart = ({
  session,
  collected,
  budget,
  outstanding,
  outstandingAccounts,
  paymentPlans,
  data,
}: Props) => {
  const rate = budget > 0 ? Math.min((collected / budget) * 100, 100) : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 w-full h-full flex flex-col">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-sm font-semibold text-gray-900">Tuition &amp; Finance</h1>
          <p className="text-[11px] text-gray-500">Collections and outstanding balances</p>
        </div>
        <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 rounded px-2 py-0.5">
          {session}
        </span>
      </div>

      <div className="flex items-end justify-between mt-4">
        <div>
          <p className="text-[9px] font-semibold tracking-wider text-gray-400">COLLECTED TO DATE</p>
          <p className="text-2xl font-bold text-gray-900">{money(collected)}</p>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-semibold tracking-wider text-gray-400">EXPECTED FEES</p>
          <p className="text-sm font-semibold text-gray-600">{money(budget)}</p>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1">
          <span>Progress Rate</span>
          <span className="font-semibold text-blue-700">{rate.toFixed(1)}% Collected</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-700 rounded-full" style={{ width: `${rate}%` }} />
        </div>
      </div>

      {budget === 0 ? (
        <div className="flex-1 min-h-[120px] mt-4 flex items-center justify-center text-center text-xs text-gray-500">
          <p>
            No fees set for {session} yet.{" "}
            <Link href="/list/accounting/fees" className="text-blue-700 font-medium">
              Add fees
            </Link>
          </p>
        </div>
      ) : (
        <div className="flex-1 min-h-[120px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1d4ed8" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef0f4" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontSize: 10 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontSize: 10 }}
                tickFormatter={compact}
                width={46}
              />
              <Tooltip
                formatter={(v) => [money(Number(v)), "Received"]}
                contentStyle={{ borderRadius: 8, borderColor: "#e5e7eb", fontSize: 12 }}
              />
              <Area
                type="monotone"
                dataKey="income"
                stroke="#1d4ed8"
                strokeWidth={2}
                fill="url(#income)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="flex flex-col gap-1.5 mt-3 text-[11px] border-t border-gray-100 pt-3">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-gray-600">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            Outstanding Balance
          </span>
          <span className="font-semibold text-red-600">
            {money(outstanding)}{" "}
            <span className="text-gray-400 font-normal">({outstandingAccounts} accounts)</span>
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-gray-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Part-payments Active
          </span>
          <span className="font-semibold text-gray-900">{paymentPlans} accounts</span>
        </div>
      </div>
    </div>
  );
};

export default FinanceChart;