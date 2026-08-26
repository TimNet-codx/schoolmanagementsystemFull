import Link from "next/link";
import Image from "next/image";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Home",
        href: "/",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/teacher.png",
        label: "Teachers",
        href: "/list/teachers",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/student.png",
        label: "Students",
        href: "/list/students",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/parent.png",
        label: "Parents",
        href: "/list/parents",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/subject.png",
        label: "Subjects",
        href: "/list/subjects",
        visible: ["admin"],
      },
      {
        icon: "/class.png",
        label: "Classes",
        href: "/list/classes",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/lesson.png",
        label: "Lessons",
        href: "/list/lessons",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/exam.png",
        label: "Exams",
        href: "/list/exams",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/assignment.png",
        label: "Assignments",
        href: "/list/assignments",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/result.png",
        label: "Results",
        href: "/list/results",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/attendance.png",
        label: "Attendance",
        href: "/list/attendance",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/calendar.png",
        label: "Events",
        href: "/list/events",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/message.png",
        label: "Messages",
        href: "/list/messages",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/announcement.png",
        label: "Announcements",
        href: "/list/announcements",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: "/profile.png",
        label: "Profile",
        href: "/profile",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/setting.png",
        label: "Settings",
        href: "/settings",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/logout.png",
        label: "Logout",
        href: "/logout",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
];

// const Menu = () => {
//     return (
//    <div className="mt-4 text-sm">
//     {
//         menuItems.map((i) => (
//             <div className="flex flex-col gap-[2px]" key={i.title}>
//                 <span className="hidden lg:block text-gray-400 font-light my-4">
//                     {i.title}
//                 </span>
//                 {i.items.map((item) => {
//                   if(item.visible.includes(role)) {
//                     return (
//                     <Link href={item.href} key={item.label}  className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-[#EDF9FD]">
//                         <Image src={item.icon} alt="" width={20} height={20} />
//                         <span className="hidden lg:block">{item.label}</span>
//                     </Link>
//                 )
//                   }
//                 }

//                 )}
//             </div>
//         ))
//     }
//    </div>
//     )
// }

// const Menu = async () => {
//   const { sessionClaims } = await auth();
//   const role = (sessionClaims?.metadata as { role?: string })?.role;

//   return (
//     <div className="mt-4 text-sm">
//       {menuItems.map((i) => (
//         <div className="flex flex-col gap-[2px]" key={i.title}>
//           <span className="hidden lg:block text-gray-400 font-light my-4">
//             {i.title}
//           </span>
//           {i.items
//             .filter((item) => role && item.visible.includes(role))
//             .map((item) => (
//               <Link
//                 href={item.href}
//                 key={item.label}
//                 className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-[#EDF9FD]"
//               >
//                 <Image src={item.icon} alt="" width={20} height={20} />
//                 <span className="hidden lg:block">{item.label}</span>
//               </Link>
//             ))}
//         </div>
//       ))}
//     </div>
//   );
// };

// const Menu = async () => {
//   const { sessionClaims } = await auth();

//   // Debug: check your terminal (server-side log) to see what's actually here
//   console.log("sessionClaims:", JSON.stringify(sessionClaims, null, 2));

//   const role = (sessionClaims?.metadata as { role?: string })?.role;

//   console.log("resolved role:", role);

//   return (
//     <div className="mt-4 text-sm">
//       {menuItems.map((i) => (
//         <div className="flex flex-col gap-[2px]" key={i.title}>
//           <span className="hidden lg:block text-gray-400 font-light my-4">
//             {i.title}
//           </span>
//           {i.items
//             .filter((item) => role && item.visible.includes(role))
//             .map((item) => (
//               <Link
//                 href={item.href}
//                 key={item.label}
//                 className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-[#EDF9FD]"
//               >
//                 <Image src={item.icon} alt="" width={20} height={20} />
//                 <span className="hidden lg:block">{item.label}</span>
//               </Link>
//             ))}
//         </div>
//       ))}
//     </div>
//   );
// };

const Menu = async () => {
  // const { userId } = await auth();

  // let role: string | undefined;

  // if (userId) {
  //   const client = await clerkClient();
  //   const user = await client.users.getUser(userId);
  //   role = (user.publicMetadata as { role?: string })?.role;
  // }

  // console.log("resolved role:", role);
  const user = await currentUser();

  const role = user?.publicMetadata.role as string;

  return (
    <div className="mt-4 text-sm">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-[2px]" key={i.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {i.title}
          </span>
          {i.items
            .filter((item) => role && item.visible.includes(role))
            .map((item) => (
              <Link
                href={item.href}
                key={item.label}
                className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-[#EDF9FD]"
              >
                <Image src={item.icon} alt="" width={20} height={20} />
                <span className="hidden lg:block">{item.label}</span>
              </Link>
            ))}
        </div>
      ))}
    </div>
  );
};

export default Menu;
