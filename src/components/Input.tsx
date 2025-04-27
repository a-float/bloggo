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
      <input
        aria-invalid={!!error}
        className="input w-full"
        autoComplete="off"
        {...rest}
      />
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
  React.ComponentProps<"input"> & {
    dayPickerProps?: DayPickerProps & { mode: "single" };
  };

export function DayPickerInput(props: DayPickerInputProps) {
  const { label, error, dayPickerProps, defaultValue, ...rest } = props;
  const [date, setDate] = React.useState<Date | undefined>(
    typeof defaultValue === "string"
      ? new Date(defaultValue)
      : defaultValue instanceof Date
      ? defaultValue
      : undefined
  );
  const popoverRef = React.useRef<HTMLDivElement>(null);

  return (
    <fieldset className="fieldset">
      <LegendLabel {...rest}>{label}</LegendLabel>
      {date && <input type="hidden" value={date?.toISOString()} {...rest} />}
      <button
        type="button"
        popoverTarget="rdp-popover"
        className="input input-border"
        style={{ anchorName: "--rdp" } as React.CSSProperties}
      >
        {date ? date.toDateString() : "Pick a date"}
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
          selected={date}
          onSelect={(date) => {
            setDate(date);
            popoverRef.current?.hidePopover();
          }}
        />
      </div>
      {error && <p className="text-error">{error}</p>}
    </fieldset>
  );
}

type FileInputProps = BaseProps &
  InputProps & { showImage?: boolean; defaultUrl?: string };

export function FileInput(props: FileInputProps) {
  const { label, error, showImage, defaultUrl, ...rest } = props;
  const [fileUrl, setFileUrl] = React.useState(defaultUrl ?? "");

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!showImage) return;
    const file = e.target.files?.item(0);
    if (file) {
      if (fileUrl) URL.revokeObjectURL(fileUrl);
      setFileUrl(URL.createObjectURL(file));
    }
  };

  return (
    <fieldset className="fieldset">
      <LegendLabel {...rest}>{label}</LegendLabel>
      <input
        {...rest}
        onChange={handleOnChange}
        type="file"
        className="file-input"
      />
      {error && <p className="text-error">{error}</p>}
      {fileUrl && <img alt="" src={fileUrl} />}
    </fieldset>
  );
}
