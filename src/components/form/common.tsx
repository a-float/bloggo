export type BaseProps = {
  label: string;
  error?: string;
};

export function LegendLabel(props: { children: string; required?: boolean }) {
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
