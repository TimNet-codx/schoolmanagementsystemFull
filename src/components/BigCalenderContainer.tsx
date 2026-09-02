import prisma from "@/lib/prisma";
import BigCalendar from "./BigCalender";
import { title } from "process";
import { adjustScheduleToCurrentweek } from "@/lib/utils";

const BigCalenderContainer = async ({
  type,
  id,
}: {
  type: "teacherId" | "classId";
  id: string | number;
}) => {
  const Responsdata = await prisma.lesson.findMany({
    where: {
      ...(type === "teacherId"
        ? { teacherId: id as string }
        : { classId: id as number }),
    },
  });

 
  const data = Responsdata.map(lesson => ({
    title: lesson.name,
    start: lesson.startTime,
    end: lesson.endTime
  }));
  const schedule = adjustScheduleToCurrentweek(data);

  return <div className="">
    <BigCalendar data={schedule}/>
  </div>;
};
export default BigCalenderContainer;
