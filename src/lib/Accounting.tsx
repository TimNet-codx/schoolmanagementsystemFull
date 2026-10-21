// Shared helpers (safe to import from server AND client components)

export const TERMS = ["First Term", "Second Term", "Third Term"] as const;

export const FEE_TITLES = [
  "School Fees",
  "PTA Levy",
  "Uniform",
  "Books",
  "Exam Fee",
  "Transport",
  "Excursion",
];

export const PLANS = [
  { value: "FULL", label: "Full payment" },
  { value: "HALF", label: "Half payment (50%)" },
  { value: "QUARTER", label: "Quarter payment (25%)" },
  { value: "CUSTOM", label: "Custom amount" },
] as const;

export const METHODS = [
  { value: "CASH", label: "Cash" },
  { value: "TRANSFER", label: "Bank transfer" },
  { value: "POS", label: "POS" },
  { value: "CHEQUE", label: "Cheque" },
] as const;

export type PayStatus = "FULL" | "HALF" | "QUARTER" | "PARTIAL" | "UNPAID";

/** Status is based on the TOTAL paid so far against the fee. */
export function getStatus(paid: number, fee: number): PayStatus {
  if (fee <= 0) return "FULL";
  if (paid <= 0) return "UNPAID";
  const r = paid / fee;
  if (r >= 1) return "FULL";
  if (r >= 0.5) return "HALF";
  if (r >= 0.25) return "QUARTER";
  return "PARTIAL";
}

export const STATUS_META: Record<PayStatus, { label: string; cls: string }> = {
  FULL: { label: "Full payment", cls: "bg-green-50 text-green-700" },
  HALF: { label: "Half payment", cls: "bg-blue-50 text-blue-700" },
  QUARTER: { label: "Quarter payment", cls: "bg-indigo-50 text-indigo-700" },
  PARTIAL: { label: "Part payment", cls: "bg-amber-50 text-amber-700" },
  UNPAID: { label: "Not paid", cls: "bg-red-50 text-red-600" },
};

export const naira = (n: number) => `₦${Math.round(n).toLocaleString("en-NG")}`;

/** Nigerian sessions start in September: Oct 2026 -> "2026/2027". */
export function currentSession(d = new Date()) {
  const y = d.getFullYear();
  return d.getMonth() >= 8 ? `${y}/${y + 1}` : `${y - 1}/${y}`;
}

export function planAmount(plan: string, fee: number, balance: number) {
  if (plan === "FULL") return balance;
  if (plan === "HALF") return Math.min(Math.round(fee * 0.5), balance);
  if (plan === "QUARTER") return Math.min(Math.round(fee * 0.25), balance);
  return 0;
}