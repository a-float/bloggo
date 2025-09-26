import React from "react";
import { commonmark } from "@milkdown/kit/preset/commonmark";
import { defaultValueCtx, Editor, rootCtx } from "@milkdown/kit/core";
import { EditorProps } from "../MarkdownEditor";
import { gfm } from "@milkdown/kit/preset/gfm";
import { history } from "@milkdown/kit/plugin/history";
import { listener, listenerCtx } from "@milkdown/kit/plugin/listener";
import { Milkdown, useEditor } from "@milkdown/react";
import { getMarkdown, replaceAll } from "@milkdown/utils";
import { trailing } from "@milkdown/kit/plugin/trailing";
import { setupTable } from "./plugins/table";
import { setupPlaceholder } from "./plugins/placeholder";
import { setupCursor } from "./plugins/cursor";
import { setupBlock } from "./plugins/block";
import { setupSlashMenu } from "./plugins/slash";
import { setupTooltip } from "./plugins/tooltip";
import { setupImage, translateImageTags } from "./plugins/image";
import { markdownToHtml } from "@/lib/markdown";

const features = [
  setupTable,
  setupPlaceholder,
  setupCursor,
  setupBlock,
  setupSlashMenu,
  setupTooltip,
  setupImage,
];

export default function MilkdownEditor(
  props: Pick<EditorProps, "defaultValue" | "onChange" | "value"> & {
    disabled?: boolean;
  }
) {
  const { get } = useEditor((root) => {
    const editor = Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root);
        // const html = markdownToHtml(props.value || "", { trusted: true });
        // const ele = document.createElement("div");
        // ele.innerHTML = html;
        // console.log(ele);
        // ctx.set(defaultValueCtx, { type: "html", dom: ele });
        // ctx.set(defaultValueCtx, props.value || props.defaultValue || "");
      })
      .use(commonmark)
      .use(gfm)
      .use(history)
      .use(listener)
      .use(trailing);

    features.forEach((setupFeature) => setupFeature(editor));

    editor.config((ctx) => {
      ctx.get(listenerCtx).markdownUpdated((_, markdown, prevMarkdown) => {
        if (markdown !== prevMarkdown) {
          console.log("new md", { markdown });
          props.onChange?.(markdown);
        }
      });
    });

    return editor;
  });

  React.useEffect(() => {
    // const html = markdownToHtml(props.value || "");
    // const ele = document.createElement("div");
    // ele.innerHTML = html;
    const fixed = translateImageTags(props.value || "");
    console.log({ fixed });
    get()?.action(replaceAll(fixed));
  }, [props.defaultValue, props.disabled]);

  return (
    <div className="p-3 lg:p-6 overflow-auto border border-base-content/20 rounded-input">
      <div className="prose">
        <Milkdown />
      </div>
    </div>
  );
}
