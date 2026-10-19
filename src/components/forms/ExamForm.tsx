// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import InputField from "../InputField";
// import { examSchema, ExamSchema } from "@/lib/formValidationSchema";
// import { createExam, updateExam } from "@/lib/serverAction";
// import {
//   Dispatch,
//   SetStateAction,
//   startTransition,
//   useActionState,
//   useEffect,
// } from "react";
// import { toast } from "react-toastify";
// import { useRouter } from "next/navigation";

// const ExamForm = ({
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
//   const startTimeFormatt = data?.startTime ? new Date(data.startTime).toISOString().slice(0, 16) : "";

//   const endTimeFormatt = data?.endTime ? new Date(data.endTime).toISOString().slice(0, 16) : "";

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<ExamSchema>({
//     resolver: zodResolver(examSchema) as any,
//     defaultValues: {
//       ...data,
//       startTime: startTimeFormatt,
//       endTime: endTimeFormatt,
//     },
//   });

//   const [state, formAction] = useActionState(
//     type === "create" ? createExam : updateExam,
//     { success: false, error: false },
//   );

//   const onSubmit = handleSubmit((data) => {
//     // console.log(data);
//     startTransition(() => {
//       formAction(data);
//     });
//   });

//   const router = useRouter();
//   useEffect(() => {
//     if (state.success) {
//       toast(`Exam has been ${type === "create" ? "create" : "updated"}!`);
//       setOpen(false);
//       router.refresh();
//     }
//   });

//   // destructure the relatedData to get the teachers array
//   // const {teachers} = relatedData.teacher || { teachers: [] };
//   const lessons = relatedData?.lessons || [];

//   return (
//     <form className="flex flex-col gap-8" onSubmit={onSubmit}>
//       <h1 className="text-xl font-semibold">
//         {type === "create" ? "Create new Exam" : "Update the exam"}
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
//           label="Exam Title"
//           name="title"
//           defaultValue={data?.title}
//           register={register}
//           error={errors?.title}
//         />
//         <InputField
//           label="Start Date"
//           name="startTime"
//           defaultValue={
//             data?.startTime
//               ? new Date(data.startTime).toISOString().slice(0, 16)
//               : ""
//           }
//           register={register}
//           error={errors?.startTime}
//           type="datetime-local"
//         />
//         <InputField
//           label="End Date"
//           name="endTime"
//           defaultValue={
//             data?.endTime
//               ? new Date(data.endTime).toISOString().slice(0, 16)
//               : ""
//           }
//           register={register}
//           error={errors?.endTime}
//           type="datetime-local"
//         />
//         <div className="flex flex-col gap-2 w-full md:w-1/4">
//           <label className="text-xs text-gray-500">Lesson</label>
//           <select
//             className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
//             {...register("lessonId")}
//             defaultValue={data?.lessonId}
//           >
//             {lessons.map((lesson: { id: number; name: string }) => (
//               <option value={lesson.id} key={lesson.id}>
//                 {lesson.name}
//               </option>
//             ))}
//           </select>
//           {errors.lessonId?.message && (
//             <p className="text-xs text-red-400">
//               {errors.lessonId.message.toString()}
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

// export default ExamForm;


"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { examSchema, ExamSchema } from "@/lib/formValidationSchema";
import { createExam, updateExam } from "@/lib/serverAction";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { FormGrid, FormProps, FormShell, SelectField } from "../FormParts";
import InputField from "../InputField";

const ExamForm = ({ type, data, setOpen, relatedData }: FormProps) => {
  const startTimeFormatt = data?.startTime
    ? new Date(data.startTime).toISOString().slice(0, 16)
    : "";
  const endTimeFormatt = data?.endTime
    ? new Date(data.endTime).toISOString().slice(0, 16)
    : "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExamSchema>({
    resolver: zodResolver(examSchema) as any,
    defaultValues: {
      ...data,
      startTime: startTimeFormatt,
      endTime: endTimeFormatt,
    },
  });

  const [state, formAction, pending] = useActionState(
    type === "create" ? createExam : updateExam,
    { success: false, error: false },
  );

  const onSubmit = handleSubmit((values) => {
    startTransition(() => formAction(values));
  });

  const router = useRouter();
  useEffect(() => {
    if (state.success) {
      toast(`Exam has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state.success, type, setOpen, router]);

  const lessons = relatedData?.lessons || [];

  return (
    <FormShell
      title={type === "create" ? "Create new exam" : "Update the exam"}
      onSubmit={onSubmit}
      error={state.error && "Something went wrong!"}
      submitLabel={type === "create" ? "Create" : "Update"}
      pending={pending}
    >
      <FormGrid>
        {data?.id && (
          <InputField label="Id" name="id" defaultValue={data?.id} register={register} error={errors?.id} hidden />
        )}
        <InputField label="Exam Title" name="title" defaultValue={data?.title} register={register} error={errors?.title} className="sm:col-span-2" />
        <SelectField label="Lesson" name="lessonId" defaultValue={data?.lessonId} register={register} error={errors.lessonId}>
          {lessons.map((l: { id: number; name: string }) => (
            <option value={l.id} key={l.id}>
              {l.name}
            </option>
          ))}
        </SelectField>
        <InputField label="Start" name="startTime" type="datetime-local" defaultValue={startTimeFormatt} register={register} error={errors?.startTime} />
        <InputField label="End" name="endTime" type="datetime-local" defaultValue={endTimeFormatt} register={register} error={errors?.endTime} />
      </FormGrid>
    </FormShell>
  );
};

export default ExamForm;
