import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

const Announcements = async () => {
  const authData = await auth();
  const { userId, sessionClaims } = authData;
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const roleConditions: Record<string, any> = {
    teacher: { lessons: { some: { teacherId: userId } } },
    student: { students: { some: { id: userId } } },
    parent: { students: { some: { parentId: userId } } },
  };

  const where =
    role === "admin" || !role
      ? {}
      : {
          OR: [{ classId: null }, { class: roleConditions[role] ?? {} }],
        };

  const data = await prisma.announcement.findMany({
    take: 6,
    orderBy: { date: "desc" },
    where,
  });

  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Announcements</h1>
        <span className="text-xs text-gray-400">View All</span>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        {data[0] && (
          <div className="bg-[#EDF9FD] rounded-md p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{data[0].title}</h2>
              <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                {new Intl.DateTimeFormat("en-GB").format(data[0].date)}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">{data[0].description}</p>
          </div>
        )}

        {data[1] && (
          <div className="bg-[#F1F0FF] rounded-md p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{data[1].title}</h2>
              <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                {new Intl.DateTimeFormat("en-GB").format(data[1].date)}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">{data[1].description}</p>
          </div>
        )}

        {data[2] && (
          <div className="bg-[#FEFCE8] rounded-md p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{data[2].title}</h2>
              <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                {new Intl.DateTimeFormat("en-GB").format(data[2].date)}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">{data[2].description}</p>
          </div>
        )}
        {data[3] && (
          <div className="bg-[#EDF9FD] rounded-md p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{data[3].title}</h2>
              <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                {new Intl.DateTimeFormat("en-GB").format(data[3].date)}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">{data[2].description}</p>
          </div>
        )}{data[4] && (
          <div className="bg-[#FEFCE8] rounded-md p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{data[4].title}</h2>
              <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                {new Intl.DateTimeFormat("en-GB").format(data[4].date)}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">{data[4].description}</p>
          </div>
        )}
        {data[5] && (
          <div className="bg-[#FEFCE8] rounded-md p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{data[5].title}</h2>
              <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                {new Intl.DateTimeFormat("en-GB").format(data[5].date)}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">{data[5].description}</p>
          </div>
        )}
         {data[6] && (
          <div className="bg-[#F1F0FF] rounded-md p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{data[6].title}</h2>
              <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                {new Intl.DateTimeFormat("en-GB").format(data[6].date)}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">{data[6].description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements;
