import { MilkdownProvider } from "@milkdown/react";
import React from "react";
// TODO import dynamically?
import MilkdownEditor from "./MilkdownEditor";
import TextareaMarkdownEditor from "./TextareaMarkdownEditor";
import { LegendLabel } from "../form/common";

type EditorType = "simple" | "visual";

export type EditorProps = {
  label: string;
  required?: boolean;
  onChange?: (markdown: string) => void;
  defaultValue?: string;
  value?: string;
  error?: { message?: string };
};

export default function MarkdownEditor(props: EditorProps) {
  const [editorType, setEditorType] = React.useState<EditorType>("simple");

  return (
    // legend and fieldset paddings acting weirdly, pt-0 as an easy fix
    <fieldset className="fieldset pt-0">
      <div className="flex gap-2 text-xs items-center">
        <LegendLabel required={props.required}>{props.label}</LegendLabel>
        <div className="flex-1" />
        <span>Simple</span>
        <input
          type="checkbox"
          defaultChecked={editorType === "visual"}
          onChange={(e) =>
            setEditorType(e.target.checked ? "visual" : "simple")
          }
          className="toggle toggle-sm toggle-primary"
        />
        <span>Visual</span>
      </div>
      {editorType === "visual" ? (
        <MilkdownProvider>
          <MilkdownEditor
            defaultValue={props.defaultValue}
            onChange={props.onChange}
            value={props.value}
          />
        </MilkdownProvider>
      ) : (
        <TextareaMarkdownEditor
          onChange={props.onChange}
          defaultValue={props.defaultValue}
          value={props.value}
        />
      )}
      {!!props.error?.message && (
        <p className="text-error">{props.error.message}</p>
      )}
    </fieldset>
  );
}
