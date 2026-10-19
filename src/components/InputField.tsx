// import { FieldError } from "react-hook-form";

// type InputFieldProps = {
//   label: string;
//   type?: string;
//   register: any;
//   name: string;
//   defaultValue?: string;
//   error?: FieldError;
//   hidden?: boolean;
//   inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
// };

// const InputField = ({
//   label,
//   type = "text",
//   register,
//   name,
//   defaultValue,
//   error,
//   inputProps,
//   hidden,
  
// }: InputFieldProps) => {
//   return (
//     <div className={hidden ? "hidden" : "flex flex-col gap-2 w-full md:w-1/4"}>
//       <label className="text-xs text-gray-500">{label}</label>
//       <input
//         type={type}
//         {...register(name)}
//         className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
//         {...inputProps}
//         defaultValue={defaultValue}
//       />
//       {error?.message && (
//         <p className="text-xs text-red-400">{error.message.toString()}</p>
//       )}
//     </div>
//   );
// };

// export default InputField;


// import { FieldError } from "react-hook-form";

// type InputFieldProps = {
//   label: string;
//   type?: string;
//   register: any;
//   name: string;
//   defaultValue?: string;
//   error?: FieldError;
//   hidden?: boolean;
//   inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
// };

// const InputField = ({
//   label,
//   type = "text",
//   register,
//   name,
//   defaultValue,
//   error,
//   inputProps,
//   hidden,
// }: InputFieldProps) => {
//   const { className: extraClassName, ...restInputProps } = inputProps ?? {};

//   return (
//     <div className={hidden ? "hidden" : "flex flex-col gap-1.5 w-full md:w-[48%] lg:w-[31%]"}>
//       <label
//         htmlFor={name}
//         className="text-[10px] font-semibold tracking-wider text-gray-500 uppercase"
//       >
//         {label}
//       </label>
//       <input
//         id={name}
//         type={type}
//         {...register(name)}
//         {...restInputProps}
//         defaultValue={defaultValue}
//         aria-invalid={error ? true : undefined}
//         className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:ring-2 ${
//           error
//             ? "border-red-300 focus:border-red-400 focus:ring-red-500/20"
//             : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
//         } ${extraClassName ?? ""}`}
//       />
//       {error?.message && (
//         <p className="text-[11px] text-red-500">{error.message.toString()}</p>
//       )}
//     </div>
//   );
// };

// export default InputField;


import { FieldError } from "react-hook-form";

type InputFieldProps = {
  label: string;
  type?: string;
  register: any;
  name: string;
  defaultValue?: string;
  error?: FieldError;
  hidden?: boolean;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  /** Extra classes for the wrapper, e.g. "sm:col-span-2" to span grid columns */
  className?: string;
};

/**
 * Sits inside <FormGrid>, which controls the column layout, so the wrapper is
 * simply full width of its grid cell.
 */
const InputField = ({
  label,
  type = "text",
  register,
  name,
  defaultValue,
  error,
  inputProps,
  hidden,
  className,
}: InputFieldProps) => {
  const { className: extraClassName, ...restInputProps } = inputProps ?? {};

  return (
    <div className={hidden ? "hidden" : `flex flex-col gap-1.5 w-full ${className ?? ""}`}>
      <label
        htmlFor={name}
        className="text-[10px] font-semibold tracking-wider text-gray-500"
      >
        {label}
      </label>
      <input
        id={name}
        type={type}
        {...register(name)}
        {...restInputProps}
        defaultValue={defaultValue}
        aria-invalid={error ? true : undefined}
        className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:ring-2 ${
          error
            ? "border-red-300 focus:border-red-400 focus:ring-red-500/20"
            : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
        } ${extraClassName ?? ""}`}
      />
      {error?.message && (
        <p className="text-[11px] text-red-500">{error.message.toString()}</p>
      )}
    </div>
  );
};

export default InputField;

