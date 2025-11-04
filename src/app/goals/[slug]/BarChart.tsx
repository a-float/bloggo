import dayjs from "dayjs";

type BarChartProps = {
  items: { createdAt: Date; value: number }[];
};

export default function BarChart(props: BarChartProps) {
  const minValue = Math.min(...props.items.map((item) => item.value));
  const maxValue = Math.max(...props.items.map((item) => item.value));

  return (
    <div className="flex h-36 items-end justify-center gap-4">
      {props.items.map((item, index) => {
        const heightPercent =
          maxValue === minValue
            ? 100
            : ((item.value - minValue) / (maxValue - minValue)) * 100;
        return (
          <div
            key={index}
            className="bg-primary"
            style={{
              minWidth: 20,
              maxWidth: 30,
              width: `${100 / props.items.length}%`,
              height: `${heightPercent}%`,
            }}
            title={`${item.value} on ${dayjs(item.createdAt).format(
              "MMM DD, YYYY"
            )}`}
          ></div>
        );
      })}
    </div>
  );
}
