import Link from "next/link";
import Image from "next/image";
import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex overflow-hidden bg-lamaSkyLight">
      {/* SIDEBAR */}
      <aside className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] h-full flex flex-col border-r border-gray-200 bg-white p-4 overflow-y-auto">
        <Link
          href="/"
          className="flex items-center justify-center lg:justify-start gap-2 mb-6"
        >
          <Image src="/logo.png" alt="School logo" width={32} height={32} />
          <span className="hidden lg:block font-semibold text-gray-800">
            School Management
          </span>
        </Link>

        <nav className="flex-1">
          <Menu />
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col bg-[#F7F8FA] overflow-y-auto">
        <Navbar />
        <main className="flex-1 p-4">{children}</main>
        
        {/* MAIN FOOTER */}
        <Footer />
      </div>
    </div>
  );
}
