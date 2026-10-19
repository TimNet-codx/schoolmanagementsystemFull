// "use client";

// import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
// import "react-big-calendar/lib/css/react-big-calendar.css";
// import moment from "moment";
// import { useState } from "react";

// const localizer = momentLocalizer(moment);

// const BigCalendar = ({
//   data,
// }: {
//   data: { title: string; start: Date; end: Date }[];
// }) => {
//   const [view, setView] = useState<View>(Views.WORK_WEEK);

//   const handleOnChangedView = (selectedView: View) => {
//     setView(selectedView);
//   };
  
//   return (
//     <Calendar
//       localizer={localizer}
//       events={data}
//       startAccessor="start"
//       endAccessor="end"
//       views={["work_week", "day"]}
//       view={view}
//       style={{ height: "98%" }}
//       onView={handleOnChangedView}
//       min={new Date(2026, 1, 0, 8, 0, 0)}
//       max={new Date(2026, 1, 0, 17, 0, 0)}
//     />
//   );
// };
// export default BigCalendar;


"use client";

import moment from "moment";
import { useState } from "react";
import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../app/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const EVENT_COLORS = [
  { bg: "#1d4ed8", border: "#1e40af" },
  { bg: "#4f46e5", border: "#4338ca" },
  { bg: "#0891b2", border: "#0e7490" },
  { bg: "#d97706", border: "#b45309" },
];

const BigCalendar = ({
  data,
}: {
  data: { title: string; start: Date; end: Date }[];
}) => {
  const [view, setView] = useState<View>(Views.WORK_WEEK);

  return (
    <Calendar
      localizer={localizer}
      events={data}
      startAccessor="start"
      endAccessor="end"
      views={["work_week", "day"]}
      view={view}
      onView={(v) => setView(v)}
      style={{ height: "100%" }}
      min={new Date(2026, 0, 1, 8, 0, 0)}
      max={new Date(2026, 0, 1, 17, 0, 0)}
      eventPropGetter={(event) => {
        // stable color per lesson title
        const i =
          event.title
            .split("")
            .reduce((sum, ch) => sum + ch.charCodeAt(0), 0) %
          EVENT_COLORS.length;
        return {
          style: {
            backgroundColor: EVENT_COLORS[i].bg,
            borderColor: EVENT_COLORS[i].border,
          },
        };
      }}
    />
  );
};

export default BigCalendar;
