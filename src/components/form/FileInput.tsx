import React from "react";
import { BaseProps, LegendLabel } from "./common";

type FileInputProps = BaseProps & {
  // previews: { url: string; name: string }[];
  onClear?: () => void;
} & React.ComponentProps<"input">;

export default function FileInput(props: FileInputProps) {
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
        {/* <button className="btn btn-ghost" type="button" onClick={clearInput}>
          Clear
        </button> */}
      </div>
      {error && <p className="text-error">{error}</p>}
      {/* {props.previews.map((preview) => (
        <div className="text-left" key={preview.url}>
          <img className="max-h-[96px] rounded-sm" alt="" src={preview.url} />
          <span>{preview.name}</span>
        </div>
      ))} */}
    </fieldset>
  );
}
