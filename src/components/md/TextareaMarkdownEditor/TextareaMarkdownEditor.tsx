import React from "react";
import Tabs from "../../Tabs";
import { EditorProps } from "../MarkdownEditor";
import MarkdownRenderer from "../MarkdownRenderer";
import { Toolbar } from "./Toolbar";

export default function SimpleMarkdownEditor(
  props: Pick<EditorProps, "defaultValue" | "onChange" | "value">
) {
  const [activeTab, setActiveTab] = React.useState<"Edit" | "Preview">("Edit");
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

  return (
    <div>
      <div className="flex">
        <Tabs
          tabs={["Edit", "Preview"]}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
        />
        <div className="flex-1" />
        <Toolbar onChange={props.onChange} textarea={textareaRef.current} />
      </div>
      <div className="input-border input-border-radius !rounded-tl-none">
        {/* Keep textarea edit history */}
        <div className={activeTab !== "Edit" ? "hidden" : ""}>
          <textarea
            ref={textareaRef}
            className="textarea border-none w-full resize-none flex-1 max-h-[455px] field-sizing-content border shadow-none"
            onChange={(e) => props.onChange?.(e.target.value)}
            value={props.value}
          />
        </div>
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
