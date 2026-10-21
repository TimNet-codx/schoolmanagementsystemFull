"use client";

import { Loader2, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { METHODS, PLANS, naira, planAmount } from "@/lib/Accounting";
import { recordPayment } from "@/lib/serverAction";

type StudentOpt = { id: string; label: string; paid: number };

const initial = { success: false, error: false } as {
  success: boolean;
  error: boolean;
  message?: string;
};

const field =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-700/30 focus:border-blue-700";
const lbl = "text-[10px] font-semibold uppercase tracking-wider text-gray-500";

/**
 * The class and the fee are chosen with the filters on the page (URL),
 * so this form only needs: student, payment type, amount, method.
 * Render it with key={feeStructureId} so it resets when the fee changes.
 */
const RecordPaymentForm = ({
  feeStructureId,
  feeLabel,
  fee,
  students,
  defaultStudentId,
}: {
  feeStructureId: number;
  feeLabel: string;
  fee: number;
  students: StudentOpt[];
  defaultStudentId?: string;
}) => {
  const router = useRouter();
  const [state, action, pending] = useActionState(recordPayment, initial);

  const [studentId, setStudentId] = useState(defaultStudentId ?? "");
  const [plan, setPlan] = useState<"FULL" | "HALF" | "QUARTER" | "CUSTOM">("FULL");
  const [amount, setAmount] = useState<number | "">("");
  const [method, setMethod] = useState("CASH");
  const [reference, setReference] = useState("");
  const [note, setNote] = useState("");

  const student = students.find((s) => s.id === studentId);
  const balance = student ? fee - student.paid : 0;

  // auto-fill the amount from the payment type
  useEffect(() => {
    if (!student) return setAmount("");
    if (plan !== "CUSTOM") setAmount(planAmount(plan, fee, balance));
  }, [studentId, plan, balance]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (state.success) {
      toast.success("Payment recorded");
      setStudentId("");
      setReference("");
      setNote("");
      setPlan("FULL");
      router.refresh();
    } else if (state.error) {
      toast.error(state.message || "Something went wrong!");
    }
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps

  const amt = Number(amount) || 0;
  const invalid = !student || balance <= 0 || amt <= 0 || amt > balance;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (invalid) return;
    startTransition(() =>
      action({ studentId, feeStructureId, plan, method: method as any, amount: amt, reference, note })
    );
  };

  return (
    <form
      onSubmit={submit}
      className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4"
    >
      <div className="flex items-center gap-2">
        <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center">
          <Wallet size={16} />
        </span>
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Record payment</h2>
          <p className="text-xs text-gray-500">
            {feeLabel} · {naira(fee)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <label className="flex flex-col gap-1.5 xl:col-span-2">
          <span className={lbl}>Student</span>
          <select className={field} value={studentId} onChange={(e) => setStudentId(e.target.value)}>
            <option value="">Select student…</option>
            {students.map((s) => (
              <option key={s.id} value={s.id} disabled={fee - s.paid <= 0}>
                {s.label}
                {fee - s.paid <= 0 ? " — fully paid" : s.paid > 0 ? ` — owes ${naira(fee - s.paid)}` : ""}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className={lbl}>Payment type</span>
          <select className={field} value={plan} onChange={(e) => setPlan(e.target.value as any)}>
            {PLANS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className={lbl}>Amount (₦)</span>
          <input
            type="number"
            min={1}
            className={field}
            value={amount}
            readOnly={plan !== "CUSTOM"}
            onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
          />
          {student && (
            <span className={`text-xs ${amt > balance ? "text-red-600" : "text-gray-500"}`}>
              Balance: {naira(balance)}
            </span>
          )}
        </label>

        <label className="flex flex-col gap-1.5">
          <span className={lbl}>Method</span>
          <select className={field} value={method} onChange={(e) => setMethod(e.target.value)}>
            {METHODS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className={lbl}>Reference (optional)</span>
          <input className={field} value={reference} onChange={(e) => setReference(e.target.value)} />
        </label>

        <label className="flex flex-col gap-1.5 md:col-span-2">
          <span className={lbl}>Note (optional)</span>
          <input className={field} value={note} onChange={(e) => setNote(e.target.value)} />
        </label>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={invalid || pending}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-60"
        >
          {pending && <Loader2 size={14} className="animate-spin" />}
          {pending ? "Saving…" : "Save payment"}
        </button>
      </div>
    </form>
  );
};

export default RecordPaymentForm;