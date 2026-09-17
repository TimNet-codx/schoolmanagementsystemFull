"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { assignmentSchema, AssignmentSchema } from "@/lib/formValidationSchema";
import { createAssignment, updateAssignment } from "@/lib/serverAction";
import {
  Dispatch,
  SetStateAction,
  startTransition,
  useActionState,
  useEffect,
} from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const AssignmentForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const startDateFormatt = data?.startDate
    ? new Date(data.startDate).toISOString().slice(0, 16)
    : "";

  const endDateFormatt = data?.dueDate
    ? new Date(data.dueDate).toISOString().slice(0, 16)
    : "";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AssignmentSchema>({
    resolver: zodResolver(assignmentSchema) as any,
    defaultValues: {
      ...data,
      startDate: startDateFormatt,
      dueDate: endDateFormatt,
    },
  });

  const [state, formAction] = useActionState(
    type === "create" ? createAssignment : updateAssignment,
    { success: false, error: false },
  );

  const onSubmit = handleSubmit((data) => {
    // console.log(data);
    startTransition(() => {
      formAction(data);
    });
  });

  const router = useRouter();
  useEffect(() => {
    if (state.success) {
      toast(`Assignment has been ${type === "create" ? "create" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  });

  // destructure the relatedData to get the teachers array
  // const {teachers} = relatedData.teacher || { teachers: [] };
  const lessons = relatedData?.lessons || [];

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create new Assignment" : "Update the Assignment"}
      </h1>
      <div className="flex justify-between flex-wrap gap-4">
        {data?.id && (
          <InputField
            label="Id"
            name="id"
            defaultValue={data?.id}
            register={register}
            error={errors?.id}
            hidden
          />
        )}
        <InputField
          label="Assignment Title"
          name="title"
          defaultValue={data?.title}
          register={register}
          error={errors?.title}
        />
        <InputField
          label="Start Date"
          name="startDate"
          defaultValue={
            data?.startDate
              ? new Date(data.startDate).toISOString().slice(0, 16)
              : ""
          }
          register={register}
          error={errors?.startDate}
          type="datetime-local"
        />
        <InputField
          label="Due Date"
          name="dueDate"
          defaultValue={
            data?.dueDate
              ? new Date(data.dueDate).toISOString().slice(0, 16)
              : ""
          }
          register={register}
          error={errors?.dueDate}
          type="datetime-local"
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Lesson</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("lessonId")}
            defaultValue={data?.lessonId}
          >
            {lessons.map((lesson: { id: number; name: string }) => (
              <option value={lesson.id} key={lesson.id}>
                {lesson.name}
              </option>
            ))}
          </select>
          {errors.lessonId?.message && (
            <p className="text-xs text-red-400">
              {errors.lessonId.message.toString()}
            </p>
          )}
        </div>
      </div>
      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default AssignmentForm;
