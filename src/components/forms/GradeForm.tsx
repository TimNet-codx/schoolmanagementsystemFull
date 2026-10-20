"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { gradeSchema, GradeSchema } from "@/lib/formValidationSchema";
import { createGrade, updateGrade } from "@/lib/serverAction";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { FormGrid, FormProps, FormShell } from "../FormParts";
import InputField from "../InputField";

const GradeForm = ({ type, data, setOpen }: FormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GradeSchema>({
    resolver: zodResolver(gradeSchema) as any,
    defaultValues: {
      ...data,
      level: data?.level ?? "",
    },
  });

  const [state, formAction, pending] = useActionState<
    { success: boolean; error: boolean; message?: string },
    GradeSchema
  >(type === "create" ? createGrade : updateGrade, {
    success: false,
    error: false,
  });

  const onSubmit = handleSubmit((values) => {
    startTransition(() => formAction(values));
  });

  const router = useRouter();
  useEffect(() => {
    if (state.success) {
      toast(`Grade has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state.success, type, setOpen, router]);

  return (
    <FormShell
      title={type === "create" ? "Create new Grade Level" : "Update Grade Level"}
      onSubmit={onSubmit}
      error={state.error && (state.message || "Something went wrong!")}
      submitLabel={type === "create" ? "Create" : "Update"}
      pending={pending}
    >
      <FormGrid>
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
          label="Grade Level (e.g. 1A, JSS1A, SSS2B)"
          name="level"
          type="text"
          defaultValue={data?.level}
          register={register}
          error={errors?.level}
        />
      </FormGrid>
    </FormShell>
  );
};

export default GradeForm;