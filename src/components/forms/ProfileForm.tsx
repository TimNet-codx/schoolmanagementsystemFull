"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { profileSchema, ProfileSchema } from "@/lib/formValidationSchema";
import { updateProfile } from "@/lib/serverAction";
import {
  Dispatch,
  SetStateAction,
  startTransition,
  useActionState,
  useEffect,
} from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const ProfileForm = ({
  data,
  setOpen,
  relatedData,
}: {
  type?: "update";
  data?: any;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema) as any,
    defaultValues: {
      id: data?.id,
      userId: data?.userId || relatedData?.currentUserId || "",
      bio: data?.bio || "",
      phone: data?.phone || "",
      address: data?.address || "",
      avatarUrl: data?.avatarUrl || "",
    },
  });

  const [state, formAction] = useActionState(updateProfile, {
    success: false,
    error: false,
  });

  const onSubmit = handleSubmit((formData) => {
    startTransition(() => {
      formAction(formData);
    });
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast("Profile updated successfully!");
      if (setOpen) setOpen(false);
      router.refresh();
    }
  }, [state.success, setOpen, router]);

  return (
    <form className="flex flex-col gap-6" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">Edit Profile Information</h1>

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
          label="User ID"
          name="userId"
          defaultValue={data?.userId || relatedData?.currentUserId}
          register={register}
          error={errors?.userId}
          hidden
        />

        <InputField
          label="Phone Number"
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

        <InputField
          label="Avatar URL"
          name="avatarUrl"
          defaultValue={data?.avatarUrl}
          register={register}
          error={errors?.avatarUrl}
        />

        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-gray-500">Bio</label>
          <textarea
            rows={3}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("bio")}
            defaultValue={data?.bio}
          />
          {errors.bio?.message && (
            <p className="text-xs text-red-400">{errors.bio.message.toString()}</p>
          )}
        </div>
      </div>

      {state.error && (
        <span className="text-red-500">
          {state.message || "Something went wrong!"}
        </span>
      )}

      <button className="bg-blue-400 text-white p-2 rounded-md font-medium">
        Save Changes
      </button>
    </form>
  );
};

export default ProfileForm;