import dayjs from "dayjs";

type BarChartProps = {
  items: { createdAt: Date; value: number }[];
};

export default function BarChart(props: BarChartProps) {
  const minValue = 0;
  const maxValue = Math.max(...props.items.map((item) => item.value));

  return (
    <div
      className="grid h-36 justify-center gap-4"
      style={{
        gridTemplateColumns: `repeat(${props.items.length}, minmax(20px, 35px)`,
      }}
    >
      {props.items.map((item, index) => {
        const heightPercent =
          maxValue === minValue
            ? 100
            : ((item.value - minValue) / (maxValue - minValue)) * 100;
        return (
          <div key={index} className="flex flex-col items-center">
            <div
              className="bg-primary mt-auto w-full rounded-md"
              style={{
                height: `${heightPercent}%`,
              }}
              title={`${item.value} on ${dayjs(item.createdAt).format(
                "MMM DD, YYYY"
              )}`}
            />
            <span className="text-sm">
              {dayjs(item.createdAt).format("MM/DD")}
            </span>
          </div>
        );
      })}
    </div>
  );
}
