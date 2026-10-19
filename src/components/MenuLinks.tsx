"use client";

import { UserButton } from "@clerk/nextjs";
import {
  BarChart3,
  BookOpen,
  Briefcase,
  CalendarCheck,
  Calendar,
  ClipboardList,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Megaphone,
  MessageSquare,
  School,
  Settings,
  UserCircle,
  Users,
  SectionIcon,
  Presentation,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Role = "admin" | "teacher" | "student" | "parent";

const ALL: Role[] = ["admin", "teacher", "student", "parent"];

const menuItems: {
  title: string;
  items: { icon: LucideIcon; label: string; href: string; visible: Role[] }[];
}[] = [
  {
    title: "MENU",
    items: [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "",
        visible: ALL,
      },
      {
        icon: Briefcase,
        label: "Teachers",
        href: "/list/teachers",
        visible: ["admin", "teacher"],
      },
      {
        icon: GraduationCap,
        label: "Students",
        href: "/list/students",
        visible: ["admin", "teacher"],
      },
      {
        icon: Users,
        label: "Parents",
        href: "/list/parents",
        visible: ["admin", "teacher"],
      },
      {
        icon: BookOpen,
        label: "Subjects",
        href: "/list/subjects",
        visible: ["admin"],
      },
      {
        icon: School,
        label: "Classes",
        href: "/list/classes",
        visible: ["admin", "teacher"],
      },
      {
        icon: Presentation,
        label: "Lessons",
        href: "/list/lessons",
        visible: ["admin", "teacher"],
      },
      { icon: FileText, label: "Exams", href: "/list/exams", visible: ALL },
      {
        icon: ClipboardList,
        label: "Assignments",
        href: "/list/assignments",
        visible: ALL,
      },
      {
        icon: BarChart3,
        label: "Results",
        href: "/list/results",
        visible: ALL,
      },
      {
        icon: CalendarCheck,
        label: "Attendance",
        href: "/list/attendance",
        visible: ALL,
      },
      { icon: Calendar, label: "Events", href: "/list/events", visible: ALL },
      {
        icon: MessageSquare,
        label: "Messages",
        href: "/list/messages",
        visible: ALL,
      },
      {
        icon: Megaphone,
        label: "Announcements",
        href: "/list/announcements",
        visible: ALL,
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      { icon: UserCircle, label: "Profile", href: "/profile", visible: ALL },
      { icon: Settings, label: "Settings", href: "/settings", visible: ALL },
      {
        icon: SectionIcon,
        label: "Admin",
        href: "/admins",
        visible: ["admin"],
      },
      {
        icon: UserCircle,
        label: "Logout",
        href: "#",
        visible: ALL,
      },
    ],
  },
];

const MenuLinks = ({ role }: { role?: string }) => {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/" || pathname === `/${role}`
      : pathname === href || (href !== `/${role}` && pathname.startsWith(href));

  return (
    <nav className="flex flex-col gap-4 text-xs">
      {menuItems.map((section) => {
        const items = section.items.filter(
          (item) => role && item.visible.includes(role as Role),
        );
        if (items.length === 0) return null;

        return (
          <div className="flex flex-col gap-0.5" key={section.title}>
            <span className="hidden lg:block text-[10px] font-semibold tracking-wider text-gray-400 px-2 mb-1">
              {section.title}
            </span>

            {items.map(({ icon: Icon, label, href }) => {
              if (label === "Logout") {
                return (
                  <div
                    key={label}
                    className="flex items-center justify-center lg:justify-start gap-3 py-2 px-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition"
                  >
                    <UserButton
                      showName
                      appearance={{
                        elements: {
                          rootBox:
                            "w-full flex items-center justify-center lg:justify-start",
                          userButtonTrigger:
                            "w-full flex items-center justify-center lg:justify-start gap-2 focus:shadow-none",
                          userButtonOuterIdentifier:
                            "hidden lg:block text-xs font-medium text-gray-600 p-0",
                          avatarBox: "w-5 h-5",
                        },
                      }}
                    />
                  </div>
                );
              }

              const targetHref = label === "Dashboard" ? `/${role}` : href;
              const active = isActive(targetHref);

              return (
                <Link
                  href={targetHref}
                  key={label}
                  title={label}
                  className={`flex items-center justify-center lg:justify-start gap-3 py-2 px-2 rounded-lg font-medium transition ${
                    active
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      active ? "text-blue-700" : "text-gray-400"
                    }`}
                  />
                  <span className="hidden lg:block">{label}</span>
                </Link>
              );
            })}
          </div>
        );
      })}
    </nav>
  );
};

export default MenuLinks;
