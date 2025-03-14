import React from "react";

type BaseProps = {
  label: string;
  error?: string;
};

type InputProps = BaseProps & React.HTMLAttributes<HTMLInputElement>;

export function Input(props: InputProps) {
  const { label, error, ...rest } = props;
  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">{label}</legend>
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

type TextareaProps = BaseProps & React.HTMLAttributes<HTMLTextAreaElement>;

export function Textarea(props: TextareaProps) {
  const { label, error, ...rest } = props;
  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">{label}</legend>
      <textarea
        aria-invalid={!!error}
        className="textarea h-24 w-full"
        autoComplete="off"
        {...rest}
      />
      {error && <p className="text-error">{error}</p>}
    </fieldset>
  );
}
