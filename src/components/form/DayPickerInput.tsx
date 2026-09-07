import clsx from "clsx";
import React from "react";
import { DayPicker, type DayPickerProps } from "react-day-picker";
import { type BaseProps, LegendLabel } from "./common";

type DayPickerInputProps = BaseProps &
  Omit<React.ComponentProps<"input">, "onChange"> & {
    onChange?: (date: Date | undefined) => void;
    dayPickerProps?: DayPickerProps & { mode: "single" };
  };

export function DayPickerInput(props: DayPickerInputProps) {
  const { label, error, dayPickerProps, defaultValue, ...rest } = props;
  const selected = dayPickerProps?.selected;

  const popoverRef = React.useRef<HTMLDivElement>(null);

  return (
    <fieldset className="fieldset">
      <LegendLabel {...rest}>{label}</LegendLabel>
      <button
        type="button"
        popoverTarget="rdp-popover"
        className={clsx(rest.className, "input")}
        style={{ anchorName: "--rdp" } as React.CSSProperties}
      >
        {selected ? selected.toDateString() : "Pick a date"}
      </button>
      <div
        ref={popoverRef}
        popover="auto"
        id="rdp-popover"
        className="dropdown"
        style={{ positionAnchor: "--rdp" } as React.CSSProperties}
      >
        <DayPicker
          className="react-day-picker"
          mode="single"
          weekStartsOn={1}
          {...dayPickerProps}
          selected={selected}
          onSelect={(date) => {
            props.onChange?.(date);
            popoverRef.current?.hidePopover();
          }}
        />
      </div>
      {error && <p className="text-error">{error}</p>}
    </fieldset>
  );
}
