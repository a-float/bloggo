import { Editor, useEditorState } from "@tiptap/react";
import clsx from "clsx";

function MenuBar({ editor }: { editor: Editor }) {
  // Read the current editor's state, and re-render the component when it changes
  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isBold: ctx.editor.isActive("bold") ?? false,
        canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
        isItalic: ctx.editor.isActive("italic") ?? false,
        canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
        isStrike: ctx.editor.isActive("strike") ?? false,
        canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
        isCode: ctx.editor.isActive("code") ?? false,
        canCode: ctx.editor.can().chain().toggleCode().run() ?? false,
        canClearMarks: ctx.editor.can().chain().unsetAllMarks().run() ?? false,
        isParagraph: ctx.editor.isActive("paragraph") ?? false,
        isHeading1: ctx.editor.isActive("heading", { level: 1 }) ?? false,
        isHeading2: ctx.editor.isActive("heading", { level: 2 }) ?? false,
        isHeading3: ctx.editor.isActive("heading", { level: 3 }) ?? false,
        isHeading4: ctx.editor.isActive("heading", { level: 4 }) ?? false,
        isHeading5: ctx.editor.isActive("heading", { level: 5 }) ?? false,
        isHeading6: ctx.editor.isActive("heading", { level: 6 }) ?? false,
        isBulletList: ctx.editor.isActive("bulletList") ?? false,
        isOrderedList: ctx.editor.isActive("orderedList") ?? false,
        isCodeBlock: ctx.editor.isActive("codeBlock") ?? false,
        isBlockquote: ctx.editor.isActive("blockquote") ?? false,
        canUndo: ctx.editor.can().chain().undo().run() ?? false,
        canRedo: ctx.editor.can().chain().redo().run() ?? false,
      };
    },
  });

  return (
    <div className="control-group">
      <div className="flex gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editorState.canBold}
          className={clsx(
            "btn btn-sm btn-soft",
            editorState.isBold ? "btn-primary" : ""
          )}
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editorState.canItalic}
          className={clsx(
            "btn btn-sm btn-soft",
            editorState.isItalic ? "btn-primary" : ""
          )}
        >
          Italic
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editorState.canStrike}
          className={clsx(
            "btn btn-sm btn-soft",
            editorState.isStrike ? "btn-primary" : ""
          )}
        >
          Strike
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editorState.canCode}
          className={clsx(
            "btn btn-sm btn-soft",
            editorState.isCode ? "btn-primary" : ""
          )}
        >
          Code
        </button>
        <button
          type="button"
          className="btn btn-sm btn-soft"
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
        >
          Clear marks
        </button>
        <button
          type="button"
          className="btn btn-sm btn-soft"
          onClick={() => editor.chain().focus().clearNodes().run()}
        >
          Clear nodes
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={clsx(
            "btn btn-sm btn-soft",
            editorState.isParagraph ? "btn-primary" : ""
          )}
        >
          Paragraph
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={clsx(
            "btn btn-sm btn-soft",
            editorState.isHeading1 ? "btn-primary" : ""
          )}
        >
          H1
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={clsx(
            "btn btn-sm btn-soft",
            editorState.isHeading2 ? "btn-primary" : ""
          )}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={clsx(
            "btn btn-sm btn-soft",
            editorState.isHeading3 ? "btn-primary" : ""
          )}
        >
          H3
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
          className={clsx(
            "btn btn-sm btn-soft",
            editorState.isHeading4 ? "btn-primary" : ""
          )}
        >
          H4
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 5 }).run()
          }
          className={clsx(
            "btn btn-sm btn-soft",
            editorState.isHeading5 ? "btn-primary" : ""
          )}
        >
          H5
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 6 }).run()
          }
          className={clsx(
            "btn btn-sm btn-soft",
            editorState.isHeading6 ? "btn-primary" : ""
          )}
        >
          H6
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={clsx(
            "btn btn-sm btn-soft",
            editorState.isBulletList ? "btn-primary" : ""
          )}
        >
          Bullet list
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={clsx(
            "btn btn-sm btn-soft",
            editorState.isOrderedList ? "btn-primary" : ""
          )}
        >
          Ordered list
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={clsx(
            "btn btn-sm btn-soft",
            editorState.isCodeBlock ? "btn-primary" : ""
          )}
        >
          Code block
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={clsx(
            "btn btn-sm btn-soft",
            editorState.isBlockquote ? "btn-primary" : ""
          )}
        >
          Blockquote
        </button>
        <button
          type="button"
          className="btn btn-sm btn-soft"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          Horizontal rule
        </button>
        <button
          type="button"
          className="btn btn-sm btn-soft"
          onClick={() => editor.chain().focus().setHardBreak().run()}
        >
          Hard break
        </button>
        <button
          type="button"
          className="btn btn-sm btn-soft"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editorState.canUndo}
        >
          Undo
        </button>
        <button
          type="button"
          className="btn btn-sm btn-soft"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editorState.canRedo}
        >
          Redo
        </button>
      </div>
    </div>
  );
}
