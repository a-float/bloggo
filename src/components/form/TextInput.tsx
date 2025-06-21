import { BaseProps, LegendLabel } from "./common";

type InputProps = BaseProps & React.ComponentProps<"input">;

export function Input(props: InputProps) {
  const { label, error, ...rest } = props;
  return (
    <fieldset className="fieldset">
      <LegendLabel {...rest}>{label}</LegendLabel>
      <input
        aria-invalid={!!error}
        {...rest}
        autoComplete="off"
        className={"input " + props.className}
      />
      {error && <p className="text-error">{error}</p>}
    </fieldset>
  );
}

type TextareaProps = BaseProps & React.ComponentProps<"textarea">;

export function Textarea(props: TextareaProps) {
  const { label, error, ...rest } = props;
  return (
    <fieldset className="fieldset flex flex-col flex-1">
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
