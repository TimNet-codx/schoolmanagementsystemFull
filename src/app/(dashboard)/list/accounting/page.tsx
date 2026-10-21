import Link from "next/link";
import { Settings2 } from "lucide-react";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/utils";
import { PayStatus, STATUS_META, getStatus, naira } from "@/lib/Accounting";
import AccountingFilters from "@/components/Accountingfilters";
import RecordPaymentForm from "@/components/forms/Recordpaymentform";
import DeleteButton from "@/components/Deletebutton";

// Place at: app/(dashboard)/list/accounting/page.tsx
type SP = {
  classId?: string;
  structureId?: string;
  status?: string;
  q?: string;
  studentId?: string;
};

const fmtDate = (d: Date) =>
  new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

const Empty = ({ children }: { children: React.ReactNode }) => (
  <div className="p-6">
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center text-sm text-gray-500">
      {children}
    </div>
  </div>
);

const AccountingPage = async ({ searchParams }: { searchParams: Promise<SP> }) => {
  const sp = await searchParams;
  const { role, currentUserId } = await getAuthUser();

  if (role !== "admin" && role !== "teacher") {
    return <Empty>You don&apos;t have access to this page.</Empty>;
  }
  const isAdmin = role === "admin";

  // Admin sees every class; a teacher only sees the classes they supervise
  const classes = await prisma.class.findMany({
    where: isAdmin ? {} : { supervisorId: currentUserId as string },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  if (classes.length === 0) {
    return <Empty>You are not the supervisor of any class yet.</Empty>;
  }

  const classId = classes.find((c) => c.id === Number(sp.classId))?.id ?? classes[0].id;

  const structures = await prisma.feeStructure.findMany({
    where: { classId },
    orderBy: [{ session: "desc" }, { term: "asc" }, { title: "asc" }],
  });
  const structure =
    structures.find((s) => s.id === Number(sp.structureId)) ?? structures[0] ?? null;

  const status = sp.status ?? "";
  const q = (sp.q ?? "").trim();

  const filters = (
    <AccountingFilters
      classes={classes}
      structures={structures.map((s) => ({
        id: s.id,
        label: `${s.title} · ${s.term} ${s.session} · ${naira(s.amount)}`,
      }))}
      classId={classId}
      structureId={structure?.id}
      status={status}
      q={q}
    />
  );

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">Fees &amp; Payments</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          {isAdmin
            ? "Record payments and see who has paid in each class."
            : "Payments for the classes you supervise."}
        </p>
      </div>
      {isAdmin && (
        <Link
          href="/list/accounting/fees"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:text-blue-700"
        >
          <Settings2 size={14} /> Manage fees
        </Link>
      )}
    </div>
  );

  if (!structure) {
    return (
      <div className="p-4 md:p-6 flex flex-col gap-5">
        {header}
        {filters}
        <Empty>
          No fee has been set for this class yet.
          {isAdmin && (
            <>
              {" "}
              <Link href="/list/accounting/fees" className="text-blue-700 font-medium">
                Add one
              </Link>
              .
            </>
          )}
        </Empty>
      </div>
    );
  }

  const students = await prisma.student.findMany({
    where: { classId },
    orderBy: [{ surname: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      surname: true,
      payments: {
        where: { feeStructureId: structure.id },
        orderBy: { paidAt: "desc" },
        select: { amount: true, paidAt: true },
      },
    },
  });

  const fee = structure.amount;

  const all = students.map((s) => {
    const paid = s.payments.reduce((t, p) => t + p.amount, 0);
    return {
      id: s.id,
      name: `${s.surname} ${s.name}`,
      paid,
      balance: Math.max(fee - paid, 0),
      status: getStatus(paid, fee),
      last: s.payments[0]?.paidAt ?? null,
    };
  });

  const counts = all.reduce(
    (acc, r) => ({ ...acc, [r.status]: (acc[r.status] ?? 0) + 1 }),
    {} as Partial<Record<PayStatus, number>>
  );
  const expected = fee * all.length;
  const collected = all.reduce((t, r) => t + r.paid, 0);

  const rows = all.filter((r) => {
    if (q && !r.name.toLowerCase().includes(q.toLowerCase())) return false;
    if (status === "PAID") return r.paid > 0;
    if (status) return r.status === status;
    return true;
  });

  const recent = await prisma.payment.findMany({
    where: { feeStructureId: structure.id },
    orderBy: { paidAt: "desc" },
    take: 10,
    select: {
      id: true,
      amount: true,
      plan: true,
      method: true,
      receiptNo: true,
      paidAt: true,
      student: { select: { name: true, surname: true } },
    },
  });

  const link = (patch: Partial<SP>) => {
    const p = new URLSearchParams();
    const merged = { classId: String(classId), structureId: String(structure.id), status, q, ...patch };
    Object.entries(merged).forEach(([k, v]) => v && p.set(k, v));
    return `?${p.toString()}`;
  };

  const chips: { key: string; label: string; count: number }[] = [
    { key: "", label: "All", count: all.length },
    { key: "FULL", label: "Full", count: counts.FULL ?? 0 },
    { key: "HALF", label: "Half", count: counts.HALF ?? 0 },
    { key: "QUARTER", label: "Quarter", count: counts.QUARTER ?? 0 },
    { key: "PARTIAL", label: "Part", count: counts.PARTIAL ?? 0 },
    { key: "UNPAID", label: "Not paid", count: counts.UNPAID ?? 0 },
  ];

  return (
    <div className="p-4 md:p-6 flex flex-col gap-5">
      {header}
      {filters}

      {/* summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Expected", value: naira(expected), cls: "text-gray-900" },
          { label: "Collected", value: naira(collected), cls: "text-green-700" },
          { label: "Outstanding", value: naira(expected - collected), cls: "text-red-600" },
        ].map((c) => (
          <div key={c.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">{c.label}</p>
            <p className={`mt-1 text-xl font-semibold ${c.cls}`}>{c.value}</p>
          </div>
        ))}
      </div>

      {isAdmin && (
        <RecordPaymentForm
          key={structure.id}
          feeStructureId={structure.id}
          feeLabel={`${structure.title} · ${structure.term} ${structure.session}`}
          fee={fee}
          students={all.map((r) => ({ id: r.id, label: r.name, paid: r.paid }))}
          defaultStudentId={sp.studentId}
        />
      )}

      {/* students table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex flex-wrap gap-2 p-4 border-b border-gray-100">
          {chips.map((c) => {
            const active = status === c.key;
            return (
              <Link
                key={c.key || "all"}
                href={link({ status: c.key })}
                className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                  active
                    ? "bg-blue-700 text-white border-blue-700"
                    : "border-gray-200 text-gray-600 hover:text-blue-700"
                }`}
              >
                {c.label} · {c.count}
              </Link>
            );
          })}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Paid</th>
                <th className="px-4 py-3">Balance</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Last payment</th>
                {isAdmin && <th className="px-4 py-3 text-right">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((r, i) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{r.name}</td>
                  <td className="px-4 py-3 text-gray-700">{naira(r.paid)}</td>
                  <td className="px-4 py-3 text-gray-700">{naira(r.balance)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_META[r.status].cls}`}
                    >
                      {STATUS_META[r.status].label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{r.last ? fmtDate(r.last) : "—"}</td>
                  {isAdmin && (
                    <td className="px-4 py-3 text-right">
                      {r.balance > 0 ? (
                        <Link
                          href={link({ studentId: r.id })}
                          className="text-xs font-medium text-blue-700 hover:underline"
                        >
                          Record payment
                        </Link>
                      ) : (
                        <span className="text-xs text-gray-400">Cleared</span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={isAdmin ? 7 : 6} className="px-4 py-10 text-center text-gray-500">
                    No students match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* recent payments */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Recent payments</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                <th className="px-4 py-3">Receipt</th>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Date</th>
                {isAdmin && <th className="px-4 py-3 text-right">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recent.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{p.receiptNo}</td>
                  <td className="px-4 py-3 text-gray-900">
                    {p.student.surname} {p.student.name}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{naira(p.amount)}</td>
                  <td className="px-4 py-3 capitalize text-gray-600">{p.plan.toLowerCase()}</td>
                  <td className="px-4 py-3 capitalize text-gray-600">{p.method.toLowerCase()}</td>
                  <td className="px-4 py-3 text-gray-500">{fmtDate(p.paidAt)}</td>
                  {isAdmin && (
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        <DeleteButton kind="payment" id={p.id} />
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {recent.length === 0 && (
                <tr>
                  <td colSpan={isAdmin ? 7 : 6} className="px-4 py-8 text-center text-gray-500">
                    No payments yet for this fee.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AccountingPage;