import { Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import clsx from "clsx";
import { FaBold, FaCode, FaItalic, FaStrikethrough } from "react-icons/fa6";

export default function MyBubbleMenu({ editor }: { editor: Editor }) {
  const buttons = [
    {
      run: () => editor.chain().focus().toggleBold().run(),
      active: editor.isActive("bold"),
      label: "Bold",
      icon: <FaBold />,
    },
    {
      run: () => editor.chain().focus().toggleItalic().run(),
      active: editor.isActive("italic"),
      label: "Italic",
      icon: <FaItalic />,
    },
    {
      run: () => editor.chain().focus().toggleStrike().run(),
      active: editor.isActive("strike"),
      label: "Strikethrough",
      icon: <FaStrikethrough />,
    },
    {
      run: () => editor.chain().focus().toggleCode().run(),
      active: editor.isActive("code"),
      label: "Code",
      icon: <FaCode />,
    },
  ];

  return (
    <BubbleMenu
      editor={editor}
      options={{ placement: "top", offset: 8, flip: true }}
      className="z-50 bg-base-200 p-1 shadow-md rounded"
    >
      <div className="bubble-menu">
        {buttons.map((btn) => (
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
      </div>
    </BubbleMenu>
  );
}
