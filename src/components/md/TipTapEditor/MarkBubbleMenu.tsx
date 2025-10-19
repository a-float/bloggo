import { Editor, useEditorState } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import clsx from "clsx";
import { FaBold, FaCode, FaItalic, FaStrikethrough } from "react-icons/fa6";

export default function MarkBubbleMenu({ editor }: { editor: Editor }) {
  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      isBold: ctx.editor.isActive("bold") ?? false,
      canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
      isItalic: ctx.editor.isActive("italic") ?? false,
      canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
      isStrike: ctx.editor.isActive("strike") ?? false,
      canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
      isCode: ctx.editor.isActive("code") ?? false,
      canCode: ctx.editor.can().chain().toggleCode().run() ?? false,
      canClearMarks: ctx.editor.can().chain().unsetAllMarks().run() ?? false,
    }),
  });

  const buttons = [
    {
      run: () => editor.chain().focus().toggleBold().run(),
      active: editorState.isBold,
      show: editorState.canBold,
      label: "Bold",
      icon: <FaBold />,
    },
    {
      run: () => editor.chain().focus().toggleItalic().run(),
      active: editorState.isItalic,
      show: editorState.canItalic,
      label: "Italic",
      icon: <FaItalic />,
    },
    {
      run: () => editor.chain().focus().toggleStrike().run(),
      active: editorState.isStrike,
      show: editorState.canStrike,
      label: "Strikethrough",
      icon: <FaStrikethrough />,
    },
    {
      run: () => editor.chain().focus().toggleCode().run(),
      active: editorState.isCode,
      show: editorState.canCode,
      label: "Code",
      icon: <FaCode />,
    },
  ].filter((btn) => btn.show);

  if (buttons.length === 0) return null;

  return (
    <BubbleMenu
      editor={editor}
      options={{ placement: "top", offset: 8, flip: true }}
      className="z-50 bg-base-200 p-1 shadow-md rounded"
    >
      {buttons
        .filter((btn) => btn.show)
        .map((btn) => (
          <button
            type="button"
            key={btn.label}
            onClick={btn.run}
            className={clsx(
              "btn btn-soft btn-xs btn-square m-1",
              btn.active && "btn-active"
            )}
          >
            {btn.icon}
          </button>
        ))}
    </BubbleMenu>
  );
}
