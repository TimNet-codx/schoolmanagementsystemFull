"use client";

import { Search } from "lucide-react";
import { useEffect, useRef } from "react";

const SearchBar = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Press "/" anywhere to focus the search box
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="hidden md:flex items-center gap-2 flex-1 max-w-md bg-gray-50 border border-gray-200 rounded-lg px-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition">
      <Search className="w-4 h-4 text-gray-400 shrink-0" />
      <input
        ref={inputRef}
        type="text"
        placeholder="Search students, classes, assignments (Press / to focus)..."
        className="w-full py-2 text-xs bg-transparent outline-none placeholder:text-gray-400"
      />
    </div>
  );
};

export default SearchBar;