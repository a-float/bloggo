import { Ctx } from "@milkdown/kit/ctx";
import { block, BlockProvider, blockSpec } from "@milkdown/kit/plugin/block";
import { FaGripVertical } from "react-icons/fa6";
import { iconToString } from "../../utils";
import { Editor } from "@milkdown/kit/core";

function blockProvider(ctx: Ctx) {
  const handle = document.createElement("div");
  handle.className = "drag-handle";
  handle.innerHTML = iconToString(FaGripVertical);

  const provider = new BlockProvider({
    ctx,
    content: handle,
    getOffset: () => 13,
  });

  return provider;
}

export function setupBlock(editor: Editor) {
  editor.config((ctx) =>
    ctx.set(blockSpec.key, {
      view: () => blockProvider(ctx),
    })
  );

  editor.use(block);
}
