"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { messageSchema, MessageSchema } from "@/lib/formValidationSchema";
import { createMessage, updateMessage } from "@/lib/serverAction";
import {
  Dispatch,
  SetStateAction,
  startTransition,
  useActionState,
  useEffect,
} from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const MessageForm = ({
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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MessageSchema>({
    resolver: zodResolver(messageSchema) as any,
    defaultValues: {
      id: data?.id,
      subject: data?.subject || "",
      content: data?.content || "",
      senderId: data?.senderId || relatedData?.currentUserId || "",
      receiverId: data?.receiverId || "",
    },
  });

  const [state, formAction] = useActionState(
    type === "create" ? createMessage : updateMessage,
    { success: false, error: false }
  );

  const onSubmit = handleSubmit((formData) => {
    startTransition(() => {
      formAction(formData);
    });
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(
        `Message has been ${type === "create" ? "sent" : "updated"}!`
      );
      setOpen(false);
      router.refresh();
    }
  }, [state.success, type, setOpen, router]);

  const users = relatedData?.users || [];

  return (
    <form className="flex flex-col gap-6" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Send New Message" : "Edit Message"}
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
          label="Sender ID"
          name="senderId"
          defaultValue={data?.senderId || relatedData?.currentUserId}
          register={register}
          error={errors?.senderId}
          hidden
        />

        {/* Recipient Select */}
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-gray-500">Recipient</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("receiverId")}
            defaultValue={data?.receiverId || ""}
          >
            <option value="">Select Recipient</option>
            {users.map((user: { id: string; name: string; role: string }) => (
              <option value={user.id} key={user.id}>
                {user.name} ({user.role})
              </option>
            ))}
          </select>
          {errors.receiverId?.message && (
            <p className="text-xs text-red-400">
              {errors.receiverId.message.toString()}
            </p>
          )}
        </div>

        <InputField
          label="Subject"
          name="subject"
          defaultValue={data?.subject}
          register={register}
          error={errors?.subject}
        />

        {/* Content Area */}
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-gray-500">Message Content</label>
          <textarea
            rows={4}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("content")}
            defaultValue={data?.content}
          />
          {errors.content?.message && (
            <p className="text-xs text-red-400">
              {errors.content.message.toString()}
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
        {type === "create" ? "Send Message" : "Update"}
      </button>
    </form>
  );
};

export default MessageForm;