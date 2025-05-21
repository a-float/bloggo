import React from "react";
import { DayPicker, type DayPickerProps } from "react-day-picker";

type BaseProps = {
  label: string;
  error?: string;
};

function LegendLabel(props: { children: string; required?: boolean }) {
  return (
    <legend className="fieldset-legend gap-0">
      <span>{props.children}</span>
      {props.required ? (
        <span className="text-error">*</span>
      ) : (
        <span className="opacity-75 font-normal">&nbsp;optional</span>
      )}
    </legend>
  );
}

type InputProps = BaseProps & React.ComponentProps<"input">;

export function Input(props: InputProps) {
  const { label, error, ...rest } = props;
  return (
    <fieldset className="fieldset">
      <LegendLabel {...rest}>{label}</LegendLabel>
      <input aria-invalid={!!error} autoComplete="off" {...rest} />
      {error && <p className="text-error">{error}</p>}
    </fieldset>
  );
}

type TextareaProps = BaseProps & React.ComponentProps<"textarea">;

export function Textarea(props: TextareaProps) {
  const { label, error, ...rest } = props;
  return (
    <fieldset className="fieldset">
      <LegendLabel {...rest}>{label}</LegendLabel>
      <textarea
        aria-invalid={!!error}
        className="textarea h-24 w-full"
        {...rest}
        autoComplete="off"
      />
      {error && <p className="text-error">{error}</p>}
    </fieldset>
  );
}

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
        className={rest.className + " input input-border"}
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

type FileInputProps = BaseProps & {
  preview?: { url: string; name: string };
  onClear?: () => void;
} & React.ComponentProps<"input">;

export function FileInput(props: FileInputProps) {
  const { label, error, onClear, ...rest } = props;
  const inputRef = React.useRef<HTMLInputElement>(null);

  const clearInput = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onClear?.();
  };

  return (
    <fieldset className="fieldset">
      <LegendLabel {...rest}>{label}</LegendLabel>
      <div className="flex flex-row">
        <input {...rest} ref={inputRef} type="file" className="file-input" />
        <button className="btn btn-ghost" type="button" onClick={clearInput}>
          Clear
        </button>
      </div>
      {error && <p className="text-error">{error}</p>}
      {props.preview && (
        <div className="text-left">
          <img
            className="max-h-[96px] rounded-sm"
            alt=""
            src={props.preview.url}
          />
          <span>{props.preview.name}</span>
        </div>
      )}
    </fieldset>
  );
}
