"use client";

import clsx from "clsx";
import dayjs from "dayjs";
import React from "react";
import localeData from "dayjs/plugin/localeData";

dayjs.extend(localeData);

type CalendarChartProps = {
  from: Date;
  to: Date;
  items: { value: number; createdAt: Date }[];
  showY?: boolean;
  showX?: boolean;
  showLegend?: boolean;
  className?: string;
  size?: "sm" | "md";
};

type TooltipState = {
  visible: boolean;
  x: number;
  y: number;
  date: Date;
};

const dateToDateKey = (date: Date) => dayjs(date).format("MMM DD, YYYY");

const getMonthNames = (from: Date, to: Date) => {
  const months: string[] = [];
  const start = dayjs(from).startOf("month");
  const end = dayjs(to).endOf("month");
  let current = start;

  while (current.isBefore(end)) {
    months.push(current.format("MMM"));
    console.log(current.format("MMM DD"));
    current = current.add(1, "month");
  }

  return months;
};

export default function CalendarChart(props: CalendarChartProps) {
  const [tooltip, setTooltip] = React.useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    date: new Date(),
  });

  const itemDayMap = React.useMemo(() => {
    const map = new Map<string, number>();
    props.items.forEach((item) => {
      const key = dateToDateKey(item.createdAt);
      map.set(key, (map.get(key) || 0) + item.value);
    });
    return map;
  }, [props.items]);

  const maxItemsPerDay = React.useMemo(() => {
    let max = 0;
    itemDayMap.forEach((count) => {
      if (count > max) {
        max = count;
      }
    });
    return max;
  }, [itemDayMap]);

  const getOpacityForDate = (date: Date) => {
    const key = dateToDateKey(date);
    if (maxItemsPerDay === 0) return 0.1;

    const ratio = (itemDayMap.get(key) ?? 0) / maxItemsPerDay;
    return ratio * 0.9 + 0.1;
  };

  const totalTimeMs = props.to.getTime() - props.from.getTime();
  const totalDays = Math.ceil(totalTimeMs / (1000 * 60 * 60 * 24));
  const firstDay = props.from.getDay();
  const cellSize = props.size === "sm" ? "w-2 h-2" : "w-2.5 h-2.5";

  const months = getMonthNames(props.from, props.to);

  const handleMouseEnter = (event: React.MouseEvent, date: Date) => {
    const rect = event.currentTarget.getBoundingClientRect();

    setTooltip({
      visible: true,
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
      date,
    });
  };

  const handleMouseLeave = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  const tooltipItems = itemDayMap.get(dateToDateKey(tooltip.date));

  return (
    <div className={props.className}>
      <div className="grid gap-2 grid-cols-[auto,1fr] grid-rows-[auto,1fr,auto]">
        <div />

        {/* Month legend */}
        {props.showX !== false && (
          <div className="text-xs text-base-content/70 flex justify-between row-start-1 col-start-2">
            {months.map((month, idx) => (
              <span key={idx}>{month}</span>
            ))}
          </div>
        )}

        {/* Day legend */}
        {props.showY !== false && (
          <div className="text-xs text-base-content/70 flex flex-col justify-between row-start-2 col-start-1">
            <span>Mon</span>
            <span>Thu</span>
            <span>Sun</span>
          </div>
        )}

        {/* Days */}
        <div className="grid grid-rows-7 gap-1 grid-flow-col row-start-2 col-start-2">
          {firstDay > 0 && <div style={{ gridRow: `1/${firstDay + 1}` }} />}
          {Array.from({ length: totalDays })
            .map((_, index) => dayjs(props.from).add(index, "days").toDate())
            .map((date, index) => (
              <div
                key={index}
                className={clsx(
                  cellSize,
                  "bg-primary hover:bg-primary transition-colors rounded-xs"
                )}
                style={{ opacity: getOpacityForDate(date) }}
                onMouseEnter={(e) => handleMouseEnter(e, date)}
                onMouseLeave={handleMouseLeave}
              />
            ))}
        </div>

        {/* Scale */}
        {props.showLegend !== false && (
          <div className="text-xs text-base-content/70 col-span-2 flex items-center gap-1 justify-end w-full row-start-3">
            <span>Less</span>
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                className={clsx(cellSize, "bg-primary rounded-xs")}
                key={idx}
                style={{ opacity: (idx / 4) * 0.9 + 0.1 }}
              />
            ))}
            <span>More</span>
          </div>
        )}
      </div>

      <div
        className={clsx(
          "fixed z-50 bg-base-300 text-base-content text-xs px-2 py-1 rounded pointer-events-none transform -translate-x-1/2 -translate-y-full",
          !tooltip.visible && "opacity-0",
          "transition-opacity duration-200"
        )}
        style={{
          left: tooltip.x,
          top: tooltip.y,
        }}
      >
        {dateToDateKey(tooltip.date)}
        {tooltipItems ? ` - ${tooltipItems} item(s)` : " - No items"}
      </div>
    </div>
  );
}
