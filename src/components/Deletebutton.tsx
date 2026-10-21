"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect } from "react";
import { toast } from "react-toastify";
import { deleteFeeStructure, deletePayment } from "@/lib/serverAction";

const initial = { success: false, error: false } as {
  success: boolean;
  error: boolean;
  message?: string;
};

const DeleteButton = ({ kind, id }: { kind: "payment" | "fee"; id: number }) => {
  const router = useRouter();
  const [state, action, pending] = useActionState(
    kind === "payment" ? deletePayment : deleteFeeStructure,
    initial
  );

  useEffect(() => {
    if (state.success) {
      toast.success(kind === "payment" ? "Payment deleted" : "Fee deleted");
      router.refresh();
    } else if (state.error) {
      toast.error(state.message || "Something went wrong!");
    }
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <button
      type="button"
      disabled={pending}
      aria-label="Delete"
      title="Delete"
      onClick={() => {
        if (!confirm(kind === "payment" ? "Delete this payment record?" : "Delete this fee?"))
          return;
        const fd = new FormData();
        fd.set("id", String(id));
        startTransition(() => action(fd));
      }}
      className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 disabled:opacity-60"
    >
      {pending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
    </button>
  );
};

export default DeleteButton;