// import Link from "next/link";

// const Footer = () => {
//   return (
//     <footer className="border-t border-gray-200 bg-white px-4 py-3 mt-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
//       <span>
//         &copy; {new Date().getFullYear()} School Management System. All rights
//         reserved.
//       </span>
//       <div className="flex items-center gap-4">
//         <Link href="/privacy" className="hover:text-gray-700 transition-colors">
//           Privacy Policy
//         </Link>
//         <Link href="/terms" className="hover:text-gray-700 transition-colors">
//           Terms of Service
//         </Link>
//         <Link href="/support" className="hover:text-gray-700 transition-colors">
//           Support
//         </Link>
//       </div>
//     </footer>
//   );
// };

// export default Footer;

import { LifeBuoy } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t border-gray-100 bg-white px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-2 text-[10px] text-gray-500">
      <span>
        &copy; {new Date().getFullYear()} School TimNet Educational Systems,
        Inc. All rights reserved.
      </span>

      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
        <Link href="/privacy" className="hover:text-gray-800 transition-colors">
          Privacy Policy
        </Link>
        <Link href="/terms" className="hover:text-gray-800 transition-colors">
          Terms of Use
        </Link>
        <Link
          href="/support"
          className="flex items-center gap-1 hover:text-gray-800 transition-colors"
        >
          <LifeBuoy className="w-3 h-3 text-blue-500" />
          Support
        </Link>
        <span className="hidden sm:inline text-gray-300">|</span>
        <span>Accessibility Standard WCAG 2.1 AA</span>
        <span>Server Region: US-East (Virginia)</span>
      </div>
    </footer>
  );
};

export default Footer;
