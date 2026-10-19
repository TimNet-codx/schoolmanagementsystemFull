"use client";

import { ImagePlus, Loader2 } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import { Dispatch, FormEventHandler, ReactNode, SetStateAction } from "react";
import { FieldError } from "react-hook-form";

/** Props every form component receives from FormModal */
export type FormProps = {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
};

const fieldClass = (hasError: boolean) =>
  `w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:ring-2 ${
    hasError
      ? "border-red-300 focus:border-red-400 focus:ring-red-500/20"
      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
  }`;

const labelClass =
  "text-[10px] font-semibold tracking-wider text-gray-500 uppercase";

/** Page chrome for every form: title, body, error banner, submit button */
export const FormShell = ({
  title,
  subtitle,
  onSubmit,
  error,
  submitLabel,
  pending,
  children,
}: {
  title: string;
  subtitle?: string;
  onSubmit: FormEventHandler<HTMLFormElement>;
  error?: string | false | null;
  submitLabel: string;
  pending?: boolean;
  children: ReactNode;
}) => (
  <form onSubmit={onSubmit} className="flex flex-col gap-5">
    <div className="pr-8">
      <h1 className="text-base font-semibold text-gray-900">{title}</h1>
      {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
    </div>

    {children}

    {error && (
      <div
        role="alert"
        className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2"
      >
        {error}
      </div>
    )}

    <div className="flex justify-end border-t border-gray-100 pt-4">
      <button
        type="submit"
        disabled={pending}
        className="flex items-center justify-center gap-2 min-w-[120px] text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-70 disabled:cursor-wait rounded-lg px-5 py-2.5 transition"
      >
        {pending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
        {pending ? "Saving…" : submitLabel}
      </button>
    </div>
  </form>
);

/** Titled group of fields (e.g. "Authentication Information") */
export const FormSection = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <section className="flex flex-col gap-3">
    <h2 className="text-[11px] font-semibold tracking-wider text-blue-700 uppercase border-b border-gray-100 pb-1.5">
      {title}
    </h2>
    {children}
  </section>
);

/** Responsive column grid for fields. Use className="sm:col-span-2" to widen one. */
export const FormGrid = ({ children }: { children: ReactNode }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
    {children}
  </div>
);

export const SelectField = ({
  label,
  name,
  register,
  error,
  children,
  multiple,
  defaultValue,
  hint,
  className,
}: {
  label: string;
  name: string;
  register: any;
  error?: FieldError;
  children: ReactNode;
  multiple?: boolean;
  defaultValue?: any;
  hint?: string;
  className?: string;
}) => (
  <div className={`flex flex-col gap-1.5 w-full ${className ?? ""}`}>
    <label htmlFor={name} className={labelClass}>
      {label}
    </label>
    <select
      id={name}
      multiple={multiple}
      defaultValue={defaultValue}
      {...register(name)}
      className={`${fieldClass(!!error)} ${multiple ? "h-32" : ""}`}
    >
      {children}
    </select>
    {hint && !error && <p className="text-[11px] text-gray-400">{hint}</p>}
    {error?.message && (
      <p className="text-[11px] text-red-500">{error.message.toString()}</p>
    )}
  </div>
);

export const TextAreaField = ({
  label,
  name,
  register,
  error,
  rows = 4,
  defaultValue,
  className,
}: {
  label: string;
  name: string;
  register: any;
  error?: FieldError;
  rows?: number;
  defaultValue?: string;
  className?: string;
}) => (
  <div className={`flex flex-col gap-1.5 w-full ${className ?? ""}`}>
    <label htmlFor={name} className={labelClass}>
      {label}
    </label>
    <textarea
      id={name}
      rows={rows}
      defaultValue={defaultValue}
      {...register(name)}
      className={fieldClass(!!error)}
    />
    {error?.message && (
      <p className="text-[11px] text-red-500">{error.message.toString()}</p>
    )}
  </div>
);

export const CheckboxField = ({
  label,
  name,
  register,
  error,
  defaultChecked,
  className,
}: {
  label: string;
  name: string;
  register: any;
  error?: FieldError;
  defaultChecked?: boolean;
  className?: string;
}) => (
  <div className={`flex flex-col gap-1.5 w-full ${className ?? ""}`}>
    <span className={labelClass}>Status</span>
    <label
      htmlFor={name}
      className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 cursor-pointer hover:bg-gray-50"
    >
      <input
        id={name}
        type="checkbox"
        defaultChecked={defaultChecked}
        {...register(name)}
        className="w-4 h-4 accent-blue-600 cursor-pointer"
      />
      {label}
    </label>
    {error?.message && (
      <p className="text-[11px] text-red-500">{error.message.toString()}</p>
    )}
  </div>
);

/** Cloudinary photo picker. Calls onUploaded(info) with the upload result. */
export const PhotoUpload = ({
  uploaded,
  hasExisting,
  onUploaded,
}: {
  uploaded: boolean;
  hasExisting?: boolean;
  onUploaded: (info: any) => void;
}) => (
  <CldUploadWidget
    uploadPreset="schoolImg"
    onSuccess={(result, { widget }) => {
      onUploaded(result.info);
      widget.close();
    }}
  >
    {({ open }) => (
      <button
        type="button"
        onClick={() => open()}
        className="flex items-center gap-3 w-max rounded-lg border border-dashed border-gray-300 bg-gray-50 hover:bg-blue-50/50 hover:border-blue-300 px-4 py-3 text-left transition"
      >
        <span className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
          <ImagePlus className="w-4 h-4" />
        </span>
        <span>
          <span className="block text-xs font-semibold text-gray-800">
            {uploaded || hasExisting ? "Change photo" : "Upload a photo"}
          </span>
          <span className="block text-[11px] text-gray-500">
            {uploaded ? "New photo ready — save to apply" : "JPG or PNG"}
          </span>
        </span>
      </button>
    )}
  </CldUploadWidget>
);
