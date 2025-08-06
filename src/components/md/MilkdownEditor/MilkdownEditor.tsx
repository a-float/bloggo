import React from "react";
import { commonmark } from "@milkdown/kit/preset/commonmark";
import { defaultValueCtx, Editor, rootCtx } from "@milkdown/kit/core";
import { EditorProps } from "../MarkdownEditor";
import { gfm } from "@milkdown/kit/preset/gfm";
import { history } from "@milkdown/kit/plugin/history";
import { listener, listenerCtx } from "@milkdown/kit/plugin/listener";
import { Milkdown, useEditor } from "@milkdown/react";
import { replaceAll } from "@milkdown/utils";
import { trailing } from "@milkdown/kit/plugin/trailing";
import { setupTable } from "./plugins/table";
import { setupPlaceholder } from "./plugins/placeholder";
import { setupCursor } from "./plugins/cursor";
import { setupBlock } from "./plugins/block";
import { setupSlashMenu } from "./plugins/slash";
import { setupTooltip } from "./plugins/tooltip";

const features = [
  setupTable,
  setupPlaceholder,
  setupCursor,
  setupBlock,
  setupSlashMenu,
  setupTooltip,
];

export default function MilkdownEditor(
  props: Pick<EditorProps, "defaultValue" | "onChange" | "value">
) {
  const { get } = useEditor((root) => {
    const editor = Editor.make()
      .config((ctx) => {
        console.log("running MilkdownEditor config");
        ctx.set(rootCtx, root);
        ctx.set(defaultValueCtx, props.value || props.defaultValue || "");

        const listener = ctx.get(listenerCtx);
        listener.markdownUpdated((_, markdown, prevMarkdown) => {
          if (markdown !== prevMarkdown) {
            props.onChange?.(markdown);
          }
        });
      })
      .use(commonmark)
      .use(gfm)
      .use(history)
      .use(listener)
      .use(trailing);

    features.forEach((setupFeature) => setupFeature(editor));

    return editor;
  });

  React.useEffect(() => {
    get()?.action(replaceAll(props.value || ""));
  }, []);

  return (
    <div className="p-3 lg:p-6 overflow-auto border border-base-content/20 rounded-input">
      <div className="prose">
        <Milkdown />
      </div>
    </div>
  );
}
