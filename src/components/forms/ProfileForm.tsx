// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import InputField from "../InputField";
// import { profileSchema, ProfileSchema } from "@/lib/formValidationSchema";
// import { updateProfile } from "@/lib/serverAction";
// import { CldUploadWidget } from "next-cloudinary";
// import {
//   Dispatch,
//   SetStateAction,
//   startTransition,
//   useActionState,
//   useEffect,
//   useState
// } from "react";
// import { toast } from "react-toastify";
// import { useRouter } from "next/navigation";
// import Image from "next/image";

// const ProfileForm = ({
//   data,
//   setOpen,
//   relatedData,
// }: {
//   type?: "update";
//   data?: any;
//   setOpen?: Dispatch<SetStateAction<boolean>>;
//   relatedData?: any;
// }) => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<ProfileSchema>({
//     resolver: zodResolver(profileSchema) as any,
//     defaultValues: {
//       id: data?.id,
//       userId: data?.userId || relatedData?.currentUserId || "",
//       username: data?.username || "",
//       name: data?.name || "",
//       surname: data?.surname || "",
//       email: data?.email || "",
//       bio: data?.bio || "",
//       phone: data?.phone || "",
//       address: data?.address || "",
//       avatarUrl: data?.avatarUrl || "",
//     },
//   });
// const [img, setImg] = useState<any>();
//   const [state, formAction] = useActionState(updateProfile, {
//     success: false,
//     error: false,
//   });

//   const onSubmit = handleSubmit((formData) => {
//     startTransition(() => {
//       formAction(formData);
//     });
//   });

//   const router = useRouter();

//   useEffect(() => {
//     if (state.success) {
//       toast("Profile updated successfully!");
//       if (setOpen) setOpen(false);
//       router.refresh();
//     }
//   }, [state.success, setOpen, router]);

//   return (
//     <form className="flex flex-col gap-6" onSubmit={onSubmit}>
//       <h1 className="text-xl font-semibold">Edit Profile Information</h1>

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
//           label="User ID"
//           name="userId"
//           defaultValue={data?.userId || relatedData?.currentUserId}
//           register={register}
//           error={errors?.userId}
//           hidden
//         />

//         <InputField
//           label="Username"
//           name="username"
//           defaultValue={data?.username}
//           register={register}
//           error={errors?.username}
//         />

//         <InputField
//           label="First Name"
//           name="name"
//           defaultValue={data?.name}
//           register={register}
//           error={errors?.name}
//         />

//         <InputField
//           label="Last Name"
//           name="surname"
//           defaultValue={data?.surname}
//           register={register}
//           error={errors?.surname}
//         />

//         <InputField
//           label="Email"
//           name="email"
//           type="email"
//           defaultValue={data?.email}
//           register={register}
//           error={errors?.email}
//         />

//         <InputField
//           label="Phone"
//           name="phone"
//           defaultValue={data?.phone}
//           register={register}
//           error={errors?.phone}
//         />

//         <InputField
//           label="Address"
//           name="address"
//           defaultValue={data?.address}
//           register={register}
//           error={errors?.address}
//         />

//         {/* <InputField
//           label="Avatar URL"
//           name="avatarUrl"
//           defaultValue={data?.avatarUrl}
//           register={register}
//           error={errors?.avatarUrl}
//         /> */}
//         <CldUploadWidget
//           uploadPreset="schoolImg"
//           onSuccess={(result, { widget }) => {
//             setImg(result.info);
//             widget.close();
//           }}
//         >
//           {({ open }) => {
//             return (
//               <div
//                 className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer w-max"
//                 onClick={() => open()}
//               >
//                 <Image src="/upload.png" alt="" width={28} height={28} />
//                 <span>
//                   {img?.secure_url || data?.img
//                     ? "Change photo"
//                     : "Upload a photo"}
//                 </span>
//               </div>
//             );
//           }}
//         </CldUploadWidget>

//         <div className="flex flex-col gap-2 w-full">
//           <label className="text-xs text-gray-500">Bio</label>
//           <textarea
//             rows={3}
//             className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
//             {...register("bio")}
//             defaultValue={data?.bio}
//           />
//           {errors.bio?.message && (
//             <p className="text-xs text-red-400">
//               {errors.bio.message.toString()}
//             </p>
//           )}
//         </div>
//       </div>

//       {state.error && (
//         <span className="text-red-500">
//           {state.message || "Something went wrong!"}
//         </span>
//       )}

//       <button className="bg-blue-400 text-white p-2 rounded-md font-medium">
//         Save Changes
//       </button>
//     </form>
//   );
// };

// export default ProfileForm;


"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, ProfileSchema } from "@/lib/formValidationSchema";
import { updateProfile } from "@/lib/serverAction";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { FormGrid, FormShell, PhotoUpload, TextAreaField } from "../FormParts";
import InputField from "../InputField";

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
      username: data?.username || "",
      name: data?.name || "",
      surname: data?.surname || "",
      email: data?.email || "",
      bio: data?.bio || "",
      phone: data?.phone || "",
      address: data?.address || "",
      avatarUrl: data?.avatarUrl || "",
    },
  });

  const [img, setImg] = useState<any>();

  const [state, formAction, pending] = useActionState(updateProfile, {
    success: false,
    error: false,
  });

  const onSubmit = handleSubmit((formData) => {
    startTransition(() => {
      // the uploaded photo was never included before; send it as the avatar
      formAction({
        ...formData,
        avatarUrl: img?.secure_url || formData.avatarUrl || "",
      });
    });
  });

  const router = useRouter();
  useEffect(() => {
    if (state.success) {
      toast("Profile updated successfully!");
      setOpen?.(false);
      router.refresh();
    }
  }, [state.success, setOpen, router]);

  return (
    <FormShell
      title="Edit profile information"
      subtitle="Update how you appear across the portal"
      onSubmit={onSubmit}
      error={state.error && ((state as any).message || "Something went wrong!")}
      submitLabel="Save Changes"
      pending={pending}
    >
      <FormGrid>
        {data?.id && (
          <InputField label="Id" name="id" defaultValue={data?.id} register={register} error={errors?.id} hidden />
        )}
        <InputField label="User ID" name="userId" defaultValue={data?.userId || relatedData?.currentUserId} register={register} error={errors?.userId} hidden />

        <InputField label="Username" name="username" defaultValue={data?.username} register={register} error={errors?.username} />
        <InputField label="First Name" name="name" defaultValue={data?.name} register={register} error={errors?.name} />
        <InputField label="Last Name" name="surname" defaultValue={data?.surname} register={register} error={errors?.surname} />
        <InputField label="Email" name="email" type="email" defaultValue={data?.email} register={register} error={errors?.email} />
        <InputField label="Phone" name="phone" defaultValue={data?.phone} register={register} error={errors?.phone} />
        <InputField label="Address" name="address" defaultValue={data?.address} register={register} error={errors?.address} />
        <TextAreaField label="Bio" name="bio" rows={3} defaultValue={data?.bio} register={register} error={errors.bio} className="sm:col-span-2 xl:col-span-3" />
      </FormGrid>

      <PhotoUpload uploaded={!!img} hasExisting={!!data?.avatarUrl || !!data?.img} onUploaded={setImg} />
    </FormShell>
  );
};

export default ProfileForm;
