import { Eye, EyeOff } from "lucide-react"; // add to your lucide import
import { useState } from "react";
import { Label } from "recharts";

const PasswordField = ({
  label,
  value,
  onChange,
  autoComplete,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete: string;
  error?: string;
}) => {
  const [show, setShow] = useState(false);
  
const inputCls =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-700/30 focus:border-blue-700 disabled:opacity-60";

  return (
    <label className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          autoComplete={autoComplete}
          className={`${inputCls} pr-10`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </label>
  );
};

export default PasswordField;