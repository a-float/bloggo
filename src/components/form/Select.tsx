import { BaseProps, LegendLabel } from "./common";

type SelectProps = BaseProps & React.ComponentProps<"select">;

export function Select(props: SelectProps) {
  const { label, error, ...rest } = props;
  return (
    <fieldset className="fieldset">
      <LegendLabel {...rest}>{label}</LegendLabel>
      <select
        {...rest}
        aria-invalid={!!error}
        autoComplete="off"
        className={"select " + props.className}
      >
        {props.children}
      </select>
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
