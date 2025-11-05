import { BaseProps, LegendLabel } from "./common";

type InputProps = BaseProps & React.ComponentProps<"input">;

export function Input(props: InputProps) {
  const { label, error, hideRequired, hideLabel, ...rest } = props;

  return (
    <fieldset className="fieldset">
      <LegendLabel {...props}>{label}</LegendLabel>
      <input
        aria-invalid={!!error}
        {...rest}
        autoComplete="off"
        className={"input " + props.className + (error ? " input-error" : "")}
      />
      {error ? <p className="text-error">{error}</p> : null}
    </fieldset>
  );
}

type TextareaProps = BaseProps & React.ComponentProps<"textarea">;

export function Textarea(props: TextareaProps) {
  const { label, error, hideRequired, hideLabel, ...rest } = props;
  return (
    <fieldset className="fieldset">
      <div className="flex justify-between items-center">
        <LegendLabel {...props}>{label}</LegendLabel>
        {!!rest.maxLength && (
          <span className="text-xs text-base-content/50">
            {rest.value ? rest.value.toString().length : 0}/{rest.maxLength}
          </span>
        )}
      </div>
      <textarea
        aria-invalid={!!error}
        {...rest}
        className={
          "textarea " + props.className + (error ? " textarea-error" : "")
        }
        autoComplete="off"
      />
      {error && <p className="text-error">{error}</p>}
    </fieldset>
  );
}
