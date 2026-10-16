// import { UserButton } from "@clerk/nextjs";
// import { currentUser } from "@clerk/nextjs/server";
// import { UserButton } from "@clerk/nextjs";
// import { UserButton } from "@clerk/nextjs";
// import { currentUser } from "@clerk/nextjs/server";
// import Image from "next/image";

// const Navbar = async () => {
//      const user = await currentUser();
//   return (
//     <div className="flex items-center justify-between p-4">
//       {/* SEARCH BAR */}
//       <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
//         <Image src="/search.png" alt="" width={14} height={14} />
//         <input
//           type="text"
//           placeholder="Search..."
//           className="w-[200px] p-2 bg-transparent outline-none"
//         />
//       </div>
//       {/* ICONS AND USER */}
//       <div className="flex items-center gap-6 justify-end w-full">
//         <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
//           <Image src="/message.png" alt="" width={20} height={20} />
//         </div>
//         <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
//           <Image src="/announcement.png" alt="" width={20} height={20} />
//           <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">
//             1
//           </div>
//         </div>
//         <div className="flex flex-col">
//           <span className="text-xs leading-3 font-medium">{user?.publicMetadata?.name as string}</span>
//           <span className="text-[10px] text-gray-500 text-right">
//             {user?.publicMetadata?.role as string}
//           </span>
//         </div>
//         {/* <Image
//           src="/avatar.png"
//           alt=""
//           width={36}
//           height={36}
//           className="rounded-full"
//         /> */}
//         {/* <UserButton /> */}
//         {/* <div className="flex items-center justify-center min-w-[32px] min-h-[32px]">
//           <UserButton signOutUrl="/sign-in" />
//         </div> */}

//         <UserButton />
//       </div>
//     </div>
//   );
// };

// export default Navbar;

import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { Bell, ClipboardCheck, MessageSquare, Plus } from "lucide-react";
import Link from "next/link";
import SearchBar from "./SearchBar";

const Navbar = async () => {
  const user = await currentUser();

  const name =
    (user?.publicMetadata?.name as string) ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    "User";
  const role = (user?.publicMetadata?.role as string) || "";
  const roleLabel = role ? role.charAt(0).toUpperCase() + role.slice(1) : "";

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-white border-b border-gray-100">
      {/* SEARCH */}
      <SearchBar />

      {/* ACTIONS + USER */}
      <div className="flex items-center gap-3 justify-end w-full md:w-auto md:ml-auto">
        <Link
          href="/list/assignments"
          className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg px-3 py-2 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          New Assignment
        </Link>

        <Link
          href="/list/attendance"
          className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg px-3 py-2 transition"
        >
          <ClipboardCheck className="w-3.5 h-3.5" />
          Take Attendance
        </Link>

        <span className="hidden sm:block w-px h-6 bg-gray-200" />

        <Link
          href="/list/messages"
          aria-label="Messages"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition"
        >
          <MessageSquare className="w-4 h-4" />
        </Link>

        <button
          type="button"
          aria-label="Notifications"
          className="relative w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-0.5 right-0.5 w-4 h-4 flex items-center justify-center bg-blue-600 text-white rounded-full text-[9px] font-semibold">
            1
          </span>
        </button>

        <div className="flex flex-col text-right leading-tight">
          <span className="text-xs font-semibold text-gray-900">{name}</span>
          {roleLabel && (
            <span className="text-[10px] text-gray-500">{roleLabel}</span>
          )}
        </div>

        <UserButton />
      </div>
    </div>
  );
};

export default Navbar;
