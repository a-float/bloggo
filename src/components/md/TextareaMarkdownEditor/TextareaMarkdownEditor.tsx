import React from "react";
import Tabs from "../../Tabs";
import { EditorProps } from "../MarkdownEditor";
import MarkdownRenderer from "../MarkdownRenderer";

export default function SimpleMarkdownEditor(
  props: Pick<EditorProps, "defaultValue" | "onChange" | "value">
) {
  const [activeTab, setActiveTab] = React.useState<"Edit" | "Preview">("Edit");

  return (
    <div>
      <Tabs
        tabs={["Edit", "Preview"]}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
      />
      <div className="input-border input-border-radius !rounded-tl-none">
        {activeTab === "Edit" && (
          <textarea
            className="textarea border-none w-full resize-none flex-1 max-h-[455px] field-sizing-content border shadow-none"
            onChange={(e) => props.onChange?.(e.target.value)}
            value={props.value}
          />
        )}
        {activeTab === "Preview" && (
          <MarkdownRenderer
            className="px-3 py-2 min-h-[80px]"
            markdown={props.value ?? ""}
          />
        )}
      </div>
    </div>
  );
}
