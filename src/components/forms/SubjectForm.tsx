// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import InputField from "../InputField";
// import { subjectSchema, SubjectSchema } from "@/lib/formValidationSchema";
// import { createSubject, updateSubject } from "@/lib/serverAction";
// import { Dispatch, SetStateAction, useActionState, useEffect } from "react";
// import { toast } from "react-toastify";
// import { useRouter } from "next/navigation";

// const SubjectForm = ({
//   type,
//   data,
//   setOpen,
//   relatedData,
// }: {
//   type: "create" | "update";
//   data?: any;
//   setOpen: Dispatch<SetStateAction<boolean>>;
//   relatedData?: any;
// }) => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<SubjectSchema>({
//     resolver: zodResolver(subjectSchema) as any,
//     defaultValues: data || { name: "" },
//   });

//   const [state, formAction] = useActionState(
//     type === "create" ? createSubject : updateSubject,
//     { success: false, error: false },
//   );

//   const onSubmit = handleSubmit((data) => {
//     // console.log(data);
//     formAction(data);
//   });

//   const router = useRouter();
//   useEffect(() => {
//     if (state.success) {
//       toast(`Subject has been ${type === "create" ? "create" : "updated"}!`);
//       setOpen(false);
//       router.refresh();
//     }
//   });

//   // destructure the relatedData to get the teachers array
//   // const {teachers} = relatedData.teacher || { teachers: [] };
//   const teachers = relatedData?.teachers || [];

//   return (
//     <form className="flex flex-col gap-8" onSubmit={onSubmit}>
//       <h1 className="text-xl font-semibold">
//         {type === "create" ? "Create new subject" : "Update the subject"}
//       </h1>
//       <div className="flex justify-between flex-wrap gap-4">
//         {data?.id && (
//           <InputField
//             label="Id"
//             name="id"
//             defaultValue={data?.id}
//             register={register}
//             error={errors?.id}
//             hidden
//           />
//         )}
//         <InputField
//           label="Subject Name"
//           name="name"
//           defaultValue={data?.name}
//           register={register}
//           error={errors?.name}
//         />
//         <div className="flex flex-col gap-2 w-full md:w-1/4">
//           <label className="text-xs text-gray-500">Teachers</label>
//           <select
//             multiple
//             className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
//             {...register("teachers")}
//             defaultValue={data?.teachers}
//           >
//             {teachers.map(
//               (teacher: { id: string; name: string; surname: string }) => (
//                 <option value={teacher.id} key={teacher.id}>
//                   {teacher.name + " " + teacher.surname}
//                 </option>
//               ),
//             )}
//           </select>
//           {errors.teachers?.message && (
//             <p className="text-xs text-red-400">
//               {errors.teachers.message.toString()}
//             </p>
//           )}
//         </div>
//       </div>
//       {state.error && (
//         <span className="text-red-500">Something went wrong!</span>
//       )}
//       <button className="bg-blue-400 text-white p-2 rounded-md">
//         {type === "create" ? "Create" : "Update"}
//       </button>
//     </form>
//   );
// };

// export default SubjectForm;


"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { subjectSchema, SubjectSchema } from "@/lib/formValidationSchema";
import { createSubject, updateSubject } from "@/lib/serverAction";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { FormGrid, FormProps, FormShell, SelectField } from "../FormParts";
import InputField from "../InputField";

const SubjectForm = ({ type, data, setOpen, relatedData }: FormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubjectSchema>({
    resolver: zodResolver(subjectSchema) as any,
    defaultValues: {
      ...data,
      name: data?.name ?? "",
      // list page passes teacher objects; the <select> needs their ids
      teachers: data?.teachers?.map((t: { id: string } | string) =>
        typeof t === "string" ? t : t.id,
      ),
    },
  });

  const [state, formAction, pending] = useActionState(
    type === "create" ? createSubject : updateSubject,
    { success: false, error: false },
  );

  const onSubmit = handleSubmit((values) => {
    startTransition(() => formAction(values));
  });

  const router = useRouter();
  useEffect(() => {
    if (state.success) {
      toast(`Subject has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state.success, type, setOpen, router]);

  const teachers = relatedData?.teachers || [];

  return (
    <FormShell
      title={type === "create" ? "Create new subject" : "Update the subject"}
      onSubmit={onSubmit}
      error={state.error && "Something went wrong!"}
      submitLabel={type === "create" ? "Create" : "Update"}
      pending={pending}
    >
      <FormGrid>
        {data?.id && (
          <InputField label="Id" name="id" defaultValue={data?.id} register={register} error={errors?.id} hidden />
        )}
        <InputField label="Subject Name" name="name" defaultValue={data?.name} register={register} error={errors?.name} />
        <SelectField
          label="Teachers"
          name="teachers"
          multiple
          register={register}
          error={errors.teachers as any}
          hint="Hold Ctrl / Cmd to select several"
        >
          {teachers.map((t: { id: string; name: string; surname: string }) => (
            <option value={t.id} key={t.id}>
              {t.name} {t.surname}
            </option>
          ))}
        </SelectField>
      </FormGrid>
    </FormShell>
  );
};

export default SubjectForm;