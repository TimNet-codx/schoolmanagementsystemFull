import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-white px-4 py-3 mt-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
      <span>
        &copy; {new Date().getFullYear()} School Management System. All rights
        reserved.
      </span>
      <div className="flex items-center gap-4">
        <Link href="/privacy" className="hover:text-gray-700 transition-colors">
          Privacy Policy
        </Link>
        <Link href="/terms" className="hover:text-gray-700 transition-colors">
          Terms of Service
        </Link>
        <Link href="/support" className="hover:text-gray-700 transition-colors">
          Support
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
