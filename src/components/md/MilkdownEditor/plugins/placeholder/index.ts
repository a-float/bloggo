import type { Node } from "@milkdown/kit/prose/model";
import { EditorState, Plugin, PluginKey } from "@milkdown/kit/prose/state";
import { $ctx, $prose } from "@milkdown/kit/utils";
import { findParent } from "@milkdown/kit/prose";
import { Decoration, DecorationSet } from "@milkdown/kit/prose/view";
import { Editor } from "@milkdown/kit/core";

interface PlaceholderConfig {
  text: string;
  mode: "doc" | "block";
}

const placeholderConfig = $ctx(
  {
    text: "Please write or type / to view commands...",
    mode: "block",
  } as PlaceholderConfig,
  "placeholderConfigCtx"
);

function isDocEmpty(doc: Node) {
  return doc.childCount <= 1 && !doc.firstChild?.content.size;
}

function createPlaceholderDecoration(
  state: EditorState,
  placeholderText: string
): Decoration | null {
  const { selection } = state;
  if (!selection.empty) return null;

  const $pos = selection.$anchor;
  const node = $pos.parent;
  if (node.content.size > 0) return null;

  const inTable = findParent((node) => node.type.name === "table")($pos);
  if (inTable) return null;

  const before = $pos.before();

  return Decoration.node(before, before + node.nodeSize, {
    class: "placeholder",
    "data-placeholder": placeholderText,
  });
}

const placeholderPlugin = $prose((ctx) => {
  return new Plugin({
    key: new PluginKey("PLACEHOLDER"),
    props: {
      decorations: (state) => {
        const config = ctx.get(placeholderConfig.key);
        if (config.mode === "doc" && !isDocEmpty(state.doc)) return null;

        // if (isInCodeBlock(state.selection) || isInList(state.selection))
        //   return null;

        const deco = createPlaceholderDecoration(state, config.text);
        if (!deco) return null;

        return DecorationSet.create(state.doc, [deco]);
      },
    },
  });
});

export function setupPlaceholder(editor: Editor) {
  editor.use(placeholderConfig);
  editor.use(placeholderPlugin);
}
