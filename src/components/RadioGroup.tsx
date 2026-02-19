import { RefCallBack } from "react-hook-form";
import { LegendLabel } from "./form/common";

type RadioGroupProps = {
  label: string;
  value?: string;
  name: string;
  options: { label: string; description?: string; value: string }[];
  onChange: (e: React.SyntheticEvent, value?: string) => void;
  ref: RefCallBack;
  required?: boolean;
};

export default function RadioGroup(props: RadioGroupProps) {
  return (
    <fieldset className="fieldset flex gap-4">
      <LegendLabel required={props.required}>{props.label}</LegendLabel>
      <div className="flex flex-col gap-1 mt-1">
        {props.options.map((option) => (
          <label className="label" key={option.value}>
            <input
              required={props.required}
              type="radio"
              name={props.name}
              value={option.value}
              ref={props.ref}
              onChange={props.onChange}
              className="radio radio-sm radio-secondary self-start"
            />
            <div className="flex flex-col ml-2">
              <span className="text-base-content font-medium">
                {option.label}
              </span>
              {option.description ? <span>{option.description}</span> : null}
            </div>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
