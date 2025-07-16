export type BaseProps = {
  label: string;
  hideLabel?: boolean;
  hideRequired?: boolean;
  error?: string;
};

export function LegendLabel(
  props: {
    children: string;
    required?: boolean;
  } & Pick<BaseProps, "hideLabel" | "hideRequired">
) {
  return (
    <legend
      className={"fieldset-legend gap-0 " + (props.hideLabel ? "sr-only" : "")}
    >
      <span>{props.children}</span>
      {props.hideRequired ? null : props.required ? (
        <span className="text-error">&nbsp;*</span>
      ) : (
        <span className="opacity-75 font-normal">&nbsp;optional</span>
      )}
    </legend>
  );
}
