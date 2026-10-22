// import FormContainer from "@/components/FormContainer";
// import prisma from "@/lib/prisma";
// import { getAuthUser } from "@/lib/utils";
// import Image from "next/image";

// const getRoleUse = async (role: string | undefined, id: string) => {
//   switch (role) {
//     case "teacher":
//       return prisma.teacher.findUnique({ where: { id } });
//     case "student":
//       return prisma.student.findUnique({ where: { id } });
//     case "parent":
//       return prisma.parent.findUnique({ where: { id } });
//     case "admin":
//       return prisma.admin.findUnique({ where: { id } });
//     default:
//       return null;
//   }
// };

// const ProfilePage = async () => {
//   const { currentUserId, role } = await getAuthUser();

//   if (!currentUserId) return <div className="p-4">Not Signed in.</div>;

//   const [profile, user] = await Promise.all([
//     prisma.profile.findUnique({ where: { userId: currentUserId } }),
//     getRoleUse(role, currentUserId),
//   ]);

//   const u = user as any;
//   const fullName = u?.name
//     ? `${u.name} ${u.surname ?? ""}`.trim()
//     : profile?.name
//       ? `${profile.name} ${profile.surname ?? ""}`.trim()
//       : null;
//   const phone = profile?.phone || u?.phone;
//   const address = profile?.address || u?.address;
//   const avatar = profile?.avatarUrl || u?.img || "/noAvatar.png";
//   return (
//     <div className="p-4 flex gap-4 flex-col md:flex-row">
//       <div className="w-full md:w-1/3 bg-white p-6 rounded-md flex flex-col items-center text-center gap-4 shadow-sm">
//         <div className="w-28 h-28 relative rounded-full overflow-hidden bg-slate-100 border">
//           {/* <Image
//             src={avatar}
//             alt="Profile Avatar"
//             fill
//             className="object-cover"
//           /> */}
//         </div>

//         <div>
//           <h2 className="text-lg font-semibold">
//             {fullName || u?.username || "User"}
//           </h2>
//           <p className="text-xs text-gray-500 capitalize">{role}</p>
//           <p className="text-xs text-gray-400">ID: {currentUserId}</p>
//         </div>

//         <div className="w-full text-left flex flex-col gap-3 mt-4 text-sm text-gray-600">
//           <div>
//             <span className="font-semibold text-gray-800">Username: </span>
//             {u?.username || "Not set"}
//           </div>
//           <div>
//             <span className="font-semibold text-gray-800">Email: </span>
//             {u?.email || "Not set"}
//           </div>
//           <div>
//             <span className="font-semibold text-gray-800">Phone: </span>
//             {phone || "Not set"}
//           </div>
//           <div>
//             <span className="font-semibold text-gray-800">Address: </span>
//             {address || "Not set"}
//           </div>
//           <div>
//             <span className="font-semibold text-gray-800">Bio: </span>
//             <p className="text-xs text-gray-500 mt-1">
//               {profile?.bio || "No bio added yet."}
//             </p>
//           </div>
//         </div>

//         <div className="mt-4 w-full">
//           <FormContainer
//             table="profile"
//             type="update"
//             data={profile || { userId: currentUserId }}
//           />
//         </div>
//       </div>

//       <div className="w-full md:w-2/3 bg-white p-6 rounded-md shadow-sm">
//         <h1 className="text-xl font-semibold mb-4">Account Settings</h1>
//         <p className="text-sm text-gray-500">
//           Manage your personal information and profile configurations.
//         </p>
//       </div>
//     </div>
//   );
// };
// export default ProfilePage;

import FormContainer from "@/components/FormContainer";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/utils";
import {
  AtSign,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { ReactNode } from "react";

const getRoleUse = async (role: string | undefined, id: string) => {
  switch (role) {
    case "teacher":
      return prisma.teacher.findUnique({ where: { id } });
    case "student":
      return prisma.student.findUnique({ where: { id } });
    case "parent":
      return prisma.parent.findUnique({ where: { id } });
    case "admin":
      return prisma.admin.findUnique({ where: { id } });
    default:
      return null;
  }
};

const DetailRow = ({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value?: string | null;
}) => (
  <div className="flex items-start gap-3">
    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[10px] font-semibold tracking-wider text-gray-500 uppercase">
        {label}
      </p>
      <p className="text-xs text-gray-900 break-words">
        {value || <span className="text-gray-400">Not set</span>}
      </p>
    </div>
  </div>
);

const ProfilePage = async () => {
  const { currentUserId, role } = await getAuthUser();

  if (!currentUserId) {
    return (
      <div className="p-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-xs text-gray-500">
          Not signed in.
        </div>
      </div>
    );
  }

  const [profile, user] = await Promise.all([
    prisma.profile.findUnique({ where: { userId: currentUserId } }),
    getRoleUse(role, currentUserId),
  ]);

  const u = user as any;
  const fullName = u?.name
    ? `${u.name} ${u.surname ?? ""}`.trim()
    : profile?.name
      ? `${profile.name} ${profile.surname ?? ""}`.trim()
      : null;
  const phone = profile?.phone || u?.phone;
  const address = profile?.address || u?.address;
  const avatar = profile?.avatarUrl || u?.img || "/noAvatar.png";
  const roleLabel = role ? role.charAt(0).toUpperCase() + role.slice(1) : "";

  // Combine profile and user table data so the form gets full defaults
  const profileFormData = {
    id: profile?.id,
    userId: currentUserId,
    username: u?.username || profile?.username || "",
    name: u?.name || profile?.name || "",
    surname: u?.surname || profile?.surname || "",
    email: u?.email || profile?.email || "",
    phone: phone || "",
    address: address || "",
    bio: profile?.bio || "",
    avatarUrl: avatar !== "/noAvatar.png" ? avatar : "",
  };

  return (
    <div className="p-4 flex flex-col md:flex-row gap-4 bg-[#F6F8FB] min-h-full">
      {/* PROFILE CARD */}
      <div className="w-full md:w-1/3 bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col items-center text-center gap-4">
        {/* plain <img> so remote avatar URLs work without next/image domain config */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatar}
          alt="Profile avatar"
          className="w-28 h-28 rounded-full object-cover ring-4 ring-blue-50 bg-slate-100"
        />

        <div>
          <h2 className="text-lg font-bold text-gray-900">
            {fullName || u?.username || "User"}
          </h2>
          {roleLabel && (
            <span className="inline-block mt-1 text-[10px] font-bold tracking-wider text-blue-600 bg-blue-50 border border-blue-100 rounded px-2 py-0.5 uppercase">
              {roleLabel}
            </span>
          )}
          <p className="text-[11px] text-gray-400 mt-2 font-mono break-all">
            ID: {currentUserId}
          </p>
        </div>

        <div className="w-full text-left border-t border-gray-100 pt-4">
          <p className="text-[10px] font-semibold tracking-wider text-gray-500 uppercase">
            Bio
          </p>
          <p className="text-xs text-gray-600 mt-1">
            {profile?.bio || "No bio added yet."}
          </p>
        </div>

        <div className="w-full flex justify-center pt-2">
          <FormContainer table="profile" type="update" data={profileFormData} />
        </div>
      </div>

      {/* DETAILS */}
      <div className="w-full md:w-2/3 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h1 className="text-sm font-semibold text-gray-900">
          Account Settings
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Manage your personal information and profile configuration.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">
          <DetailRow
            icon={<UserRound className="w-4 h-4" />}
            label="Full name"
            value={fullName}
          />
          <DetailRow
            icon={<AtSign className="w-4 h-4" />}
            label="Username"
            value={u?.username}
          />
          <DetailRow
            icon={<Mail className="w-4 h-4" />}
            label="Email"
            value={u?.email}
          />
          <DetailRow
            icon={<Phone className="w-4 h-4" />}
            label="Phone"
            value={phone}
          />
          <DetailRow
            icon={<MapPin className="w-4 h-4" />}
            label="Address"
            value={address}
          />
          <DetailRow
            icon={<ShieldCheck className="w-4 h-4" />}
            label="Role"
            value={roleLabel}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
