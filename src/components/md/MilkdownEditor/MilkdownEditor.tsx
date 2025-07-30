import { commonmark } from "@milkdown/kit/preset/commonmark";
import { defaultValueCtx, Editor, rootCtx } from "@milkdown/kit/core";
import { EditorProps } from "../MarkdownEditor";
import { gfm } from "@milkdown/kit/preset/gfm";
import { history } from "@milkdown/kit/plugin/history";
import { listener, listenerCtx } from "@milkdown/kit/plugin/listener";
import { Milkdown, useEditor } from "@milkdown/react";
import { replaceAll } from "@milkdown/utils";
import { tableBlock } from "@milkdown/components/table-block";
import React from "react";

export default function MilkdownEditor(
  props: Pick<EditorProps, "defaultValue" | "onChange" | "value">
) {
  const { get } = useEditor((root) =>
    Editor.make()
      .config((ctx) => {
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
      .use(tableBlock)
      .use(history)
      .use(listener)
  );

  React.useEffect(() => {
    get()?.action(replaceAll(props.value || ""));
  }, []);

  return (
    <div className="px-3 max-h-[350px] overflow-auto input-border input-border-radius">
      <div className="prose py-3">
        <Milkdown />
      </div>
    </div>
  );
}
