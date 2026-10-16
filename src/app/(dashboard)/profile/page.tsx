import FormContainer from "@/components/FormContainer";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/utils";
import Image from "next/image";

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

const ProfilePage = async () => {
  const { currentUserId, role } = await getAuthUser();

  if (!currentUserId) return <div className="p-4">Not Signed in.</div>;

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
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      <div className="w-full md:w-1/3 bg-white p-6 rounded-md flex flex-col items-center text-center gap-4 shadow-sm">
        <div className="w-28 h-28 relative rounded-full overflow-hidden bg-slate-100 border">
          {/* <Image
            src={avatar}
            alt="Profile Avatar"
            fill
            className="object-cover"
          /> */}
        </div>

        <div>
          <h2 className="text-lg font-semibold">
            {fullName || u?.username || "User"}
          </h2>
          <p className="text-xs text-gray-500 capitalize">{role}</p>
          <p className="text-xs text-gray-400">ID: {currentUserId}</p>
        </div>

        <div className="w-full text-left flex flex-col gap-3 mt-4 text-sm text-gray-600">
          <div>
            <span className="font-semibold text-gray-800">Username: </span>
            {u?.username || "Not set"}
          </div>
          <div>
            <span className="font-semibold text-gray-800">Email: </span>
            {u?.email || "Not set"}
          </div>
          <div>
            <span className="font-semibold text-gray-800">Phone: </span>
            {phone || "Not set"}
          </div>
          <div>
            <span className="font-semibold text-gray-800">Address: </span>
            {address || "Not set"}
          </div>
          <div>
            <span className="font-semibold text-gray-800">Bio: </span>
            <p className="text-xs text-gray-500 mt-1">
              {profile?.bio || "No bio added yet."}
            </p>
          </div>
        </div>

        <div className="mt-4 w-full">
          <FormContainer
            table="profile"
            type="update"
            data={profile || { userId: currentUserId }}
          />
        </div>
      </div>

      <div className="w-full md:w-2/3 bg-white p-6 rounded-md shadow-sm">
        <h1 className="text-xl font-semibold mb-4">Account Settings</h1>
        <p className="text-sm text-gray-500">
          Manage your personal information and profile configurations.
        </p>
      </div>
    </div>
  );
};
export default ProfilePage;
