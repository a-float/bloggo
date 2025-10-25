import { Editor, useEditorState } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import clsx from "clsx";
import { FaMinus, FaPlus } from "react-icons/fa6";

function getSelectedImageSize() {
  const realWidth = document.querySelector<HTMLImageElement>(
    "img.ProseMirror-selectednode"
  )?.naturalWidth;
  if (!realWidth) return null;
  return Math.min(realWidth ?? 0, 700);
}

export default function ImageBubbleMenu({ editor }: { editor: Editor }) {
  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      isImage: ctx.editor.isActive("image"),
      imageAttrs: ctx.editor.getAttributes("image"),
    }),
  });

  const changeImageScale = (diff: -0.1 | 0.1) => {
    const fullWidth = getSelectedImageSize();
    if (!fullWidth) return;
    const currentWidth = parseInt(editorState.imageAttrs.width);
    const scale = currentWidth ? currentWidth / fullWidth : 1;

    const newScale = Math.min(1, Math.max(0.1, scale + diff));
    editor
      .chain()
      .updateAttributes("image", {
        width: Math.round(fullWidth * newScale) + "px",
      })
      .run();
  };

  return (
    <BubbleMenu
      editor={editor}
      options={{ placement: "top", offset: 8, flip: false }}
      className="z-50 bg-base-200 p-1 shadow-md rounded"
      pluginKey="image-bubble-menu"
      shouldShow={({ editor }) => {
        return editor.isActive("image");
      }}
    >
      <button
        type="button"
        onClick={() => changeImageScale(-0.1)}
        className={clsx("btn btn-soft btn-xs btn-square m-1")}
      >
        <FaMinus />
      </button>
      <button
        type="button"
        onClick={() => changeImageScale(0.1)}
        className={clsx("btn btn-soft btn-xs btn-square m-1")}
      >
        <FaPlus />
      </button>
    </BubbleMenu>
  );
}
