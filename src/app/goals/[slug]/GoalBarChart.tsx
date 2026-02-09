"use client";
import dayjs from "dayjs";
import { BarChart, Bar, XAxis, CartesianGrid } from "recharts";

type BarChartProps = {
  items: { createdAt: Date; value: number }[];
  unit: string | null;
  daysPast: number;
  className?: string;
};

export default function GoalBarChart(props: BarChartProps) {
  const dayRange = props.daysPast;
  const from = dayjs().subtract(dayRange - 1, "days");

  const data = Array.from({ length: dayRange }).map((_, idx) => {
    const date = from.add(idx, "days");
    const itemsForData = props.items.filter((item) =>
      dayjs(item.createdAt).isSame(date, "day")
    );
    const sum = itemsForData.reduce((acc, item) => acc + item.value, 0);
    return {
      name: date.isSame(dayjs(), "day") ? "Today" : date.format("MM/DD"),
      progress: sum,
    };
  });

  return (
    <>
      <span className="text-base-content/70 text-sm">
        {from.format("DD MMMM")} - {dayjs().format("DD MMMM")}
      </span>
      <div className="overflow-auto scrollbar-hide">
        <BarChart
          className={props.className}
          responsive
          accessibilityLayer
          data={data}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="30%"
                stopColor="var(--color-base-content)"
                stopOpacity={1}
              />
              <stop
                offset="100%"
                stopColor="var(--color-base-content)"
                stopOpacity={0.3}
              />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="name"
            tickLine={false}
            tickMargin={6}
            axisLine={false}
          />

          <Bar
            dataKey="progress"
            fill="url(#colorUv)"
            radius={4}
            barSize={24}
          />
        </BarChart>
      </div>
      {/* <span className="text-base-content/70">
        Total last week progress:{" "}
        {data.reduce((acc, item) => acc + item.progress, 0)}
        {props.unit ? ` ${props.unit}` : ""}
      </span> */}
    </>
  );
}
