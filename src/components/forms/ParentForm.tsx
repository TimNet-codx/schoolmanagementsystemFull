"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { parentSchema, ParentSchema } from "@/lib/formValidationSchema";
import {
  Dispatch,
  SetStateAction,
  startTransition,
  useActionState,
  useEffect,
} from "react";
import { createParent, updateParent } from "@/lib/serverAction";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const ParentForm = ({
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
  const defaultStudentIds = data?.students
    ? data.students.map((student: { id: string }) => student.id)
    : [];

  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm<ParentSchema>({ resolver: zodResolver(parentSchema) });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ParentSchema>({
    resolver: zodResolver(parentSchema),
    defaultValues: {
      username: data?.username,
      email: data?.email,
      password: data?.password,
      name: data?.name,
      surname: data?.surname,
      phone: data?.phone,
      address: data?.address,
      sex: data?.sex,
      students: defaultStudentIds,
    },
  });
  const [state, formAction] = useActionState<
    { success: boolean; error: boolean; message?: string | undefined },
    ParentSchema
  >(type === "create" ? createParent : updateParent, {
    success: false,
    error: false,
    message: undefined,
  });

  const onSubmit = handleSubmit((data) => {
    // formAction({ ...data, img: img?.secure_url });
    startTransition(() => {
      formAction({ ...data });
    });
  });

  const router = useRouter();
  useEffect(() => {
    if (state.success) {
      toast(`Parent has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  });

  const students = relatedData?.students || [];
  console.log("FORM_MODAL_RELATED_DATA:", students);

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">Create a new Parent</h1>
      <span className="text-xs text-gray-400 font-medium">
        Authentication Information
      </span>
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
          label="Username"
          name="username"
          defaultValue={data?.username}
          register={register}
          error={errors?.username}
        />
        <InputField
          label="Email"
          name="email"
          type="email"
          defaultValue={data?.email}
          register={register}
          error={errors?.email}
        />
        <InputField
          label="Password (Demo1234)"
          name="password"
          type="password"
          defaultValue={data?.password}
          register={register}
          error={errors?.password}
        />
      </div>
      <span className="text-xs text-gray-400 font-medium">
        Personal Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="First Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name}
        />
        <InputField
          label="Last Name"
          name="surname"
          defaultValue={data?.surname}
          register={register}
          error={errors?.surname}
        />
        <InputField
          label="Phone"
          name="phone"
          defaultValue={data?.phone}
          register={register}
          error={errors?.phone}
        />
        <InputField
          label="Address"
          name="address"
          defaultValue={data?.address}
          register={register}
          error={errors?.address}
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Sex</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("sex")}
            defaultValue={data?.sex}
          >
            <option value="MALE">MALE</option>
            <option value="FEMALE">FEMALE</option>
          </select>
          {errors.sex?.message && (
            <p className="text-xs text-red-400">
              {errors.sex.message.toString()}
            </p>
          )}
        </div>
        {/* <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Students</label>
          <select
            multiple
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full h-32"
            {...register("students")}
          >
            {students?.map(
              (student: { id: string; name: string; surname?: string }) => (
                <option value={student.id} key={student.id}>
                  {student.name} {student.surname || ""}
                </option>
              ),
            )}
          </select>
          {errors.students?.message && (
            <p className="text-xs text-red-400">
              {errors.students.message.toString()}
            </p>
          )}
        </div> */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Students</label>
          <select
            multiple
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full h-32"
            {...register("students")}
          >
            {students.map(
              (student: { id: string; name: string; surname?: string }) => (
                <option value={student.id} key={student.id}>
                  {student.name + " " + student.surname}
                </option>
              )
            )}
          </select>
          {errors.students?.message && (
            <p className="text-xs text-red-400">
              {errors.students.message.toString()}
            </p>
          )}
        </div>
      </div>
      {state.error && (
        <span className="text-red-500">
          {state.message || "Something went wrong!"}
        </span>
      )}
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default ParentForm;
