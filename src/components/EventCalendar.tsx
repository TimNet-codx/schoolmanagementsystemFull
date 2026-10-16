// "use client";

// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";

// type ValuePiece = Date | null;

// type Value = ValuePiece | [ValuePiece, ValuePiece];



// const EventCalendar = () => {
//   const [value, onChange] = useState<Value>(new Date());

//   // Update the URL when select the event date
//   const router = useRouter();

//   useEffect(() => {
//    if(value instanceof Date){
//     router.push(`?date=${value}`);
//    }
//   },[value, router]);


//   return <Calendar onChange={onChange} value={value} />;
// };

// export default EventCalendar;


"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const WEEKDAYS = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];

const toKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

const EventCalendar = () => {
  const router = useRouter();
  const params = useSearchParams();
  const selectedKey = params.get("date") ?? toKey(new Date());

  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7; // Monday first
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  const cells: { date: Date; inMonth: boolean }[] = [];
  for (let i = firstWeekday - 1; i >= 0; i--) {
    cells.push({ date: new Date(year, month - 1, daysInPrev - i), inMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(year, month, d), inMonth: true });
  }
  while (cells.length % 7 !== 0) {
    const next = cells.length - (firstWeekday + daysInMonth) + 1;
    cells.push({ date: new Date(year, month + 1, next), inMonth: false });
  }

  const todayKey = toKey(new Date());
  const title = cursor.toLocaleString("en-US", { month: "long", year: "numeric" });

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-900">Academic Calendar</h2>
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <button
            type="button"
            aria-label="Previous month"
            onClick={() => setCursor(new Date(year, month - 1, 1))}
            className="p-1 rounded hover:bg-gray-100"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="min-w-[110px] text-center font-medium">{title}</span>
          <button
            type="button"
            aria-label="Next month"
            onClick={() => setCursor(new Date(year, month + 1, 1))}
            className="p-1 rounded hover:bg-gray-100"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 text-center text-[10px] font-semibold text-gray-400 mb-1">
        {WEEKDAYS.map((d) => (
          <span key={d} className="py-1">
            {d}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1 text-center text-xs">
        {cells.map(({ date, inMonth }) => {
          const key = toKey(date);
          const selected = key === selectedKey;
          const isToday = key === todayKey;
          return (
            <button
              key={key}
              type="button"
              onClick={() => router.push(`?date=${key}`)}
              className={`mx-auto w-8 h-8 rounded-md transition ${
                selected
                  ? "bg-blue-700 text-white font-semibold"
                  : isToday
                  ? "ring-1 ring-blue-300 text-blue-700 font-semibold"
                  : inMonth
                  ? "text-gray-700 hover:bg-gray-100"
                  : "text-gray-300 hover:bg-gray-50"
              }`}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default EventCalendar;
