import prisma from "@/lib/prisma";
import { currentSession } from "@/lib/Accounting";
import FinanceChart from "./FinanceChart";

// Session months in order (Nigerian school year: September -> August)
const MONTHS = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
const monthIndex = (d: Date) => (d.getMonth() + 4) % 12; // Sep(8) -> 0, Jan(0) -> 4

const FinanceChartContainer = async () => {
  const session = currentSession();

  const [structures, payments] = await Promise.all([
    prisma.feeStructure.findMany({
      where: { session },
      select: {
        id: true,
        amount: true,
        class: { select: { _count: { select: { students: true } } } },
      },
    }),
    prisma.payment.findMany({
      where: { feeStructure: { session } },
      select: { amount: true, paidAt: true, studentId: true, feeStructureId: true },
    }),
  ]);

  // what the school expects: each fee x number of students in that class
  const feeById = new Map(structures.map((s) => [s.id, s.amount]));
  const budget = structures.reduce((t, s) => t + s.amount * s.class._count.students, 0);
  const totalAccounts = structures.reduce((t, s) => t + s.class._count.students, 0);

  // money received, per month, and per (student, fee) account
  const monthly = MONTHS.map((name) => ({ name, income: 0 }));
  const perAccount = new Map<string, { paid: number; fee: number }>();
  let collected = 0;

  for (const p of payments) {
    collected += p.amount;
    monthly[monthIndex(p.paidAt)].income += p.amount;

    const key = `${p.studentId}:${p.feeStructureId}`;
    const acc = perAccount.get(key) ?? { paid: 0, fee: feeById.get(p.feeStructureId) ?? 0 };
    acc.paid += p.amount;
    perAccount.set(key, acc);
  }

  let fullyPaid = 0;
  let paymentPlans = 0; // started paying but still owe something
  perAccount.forEach((a) => {
    if (a.paid >= a.fee) fullyPaid += 1;
    else paymentPlans += 1;
  });

  return (
    <FinanceChart
      session={session}
      collected={collected}
      budget={budget}
      outstanding={Math.max(budget - collected, 0)}
      outstandingAccounts={Math.max(totalAccounts - fullyPaid, 0)}
      paymentPlans={paymentPlans}
      data={monthly}
    />
  );
};

export default FinanceChartContainer;