import { Editor } from "@milkdown/kit/core";
import { cursor, dropCursorConfig } from "@milkdown/kit/plugin/cursor";

export function setupCursor(editor: Editor) {
  editor.config((ctx) =>
    ctx.update(dropCursorConfig.key, () => ({
      width: 2,
      class: "drop-cursor",
      color: "var(--color-primary)",
    }))
  );

  editor.use(cursor);
  // const virtualCursor = createVirtualCursor();
  // editor.use($prose(() => virtualCursor));
}
