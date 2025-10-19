import { Editor } from "@tiptap/react";

export type Command =
  | `h${1 | 2 | 3 | 4}`
  | "bullet"
  | "ordered"
  | "quote"
  | "image"
  | "hr";

export function insertImage(editor: Editor, src: string, alt?: string) {
  return editor
    .chain()
    .focus()
    .setImage({ src, alt: alt || "Image" })
    .run();
}

export function executeCommand(
  editor: Editor,
  cmd: Command,
  options?: { onImageInsert?: () => void }
) {
  switch (cmd) {
    case "h1":
      return editor.chain().focus().setHeading({ level: 1 }).run();

    case "h2":
      return editor.chain().focus().setHeading({ level: 2 }).run();

    case "h3":
      return editor.chain().focus().setHeading({ level: 3 }).run();

    case "h4":
      return editor.chain().focus().setHeading({ level: 4 }).run();

    case "bullet":
      return editor.chain().focus().toggleBulletList().run();

    case "ordered":
      return editor.chain().focus().toggleOrderedList().run();

    case "quote":
      return editor.chain().focus().toggleBlockquote().run();

    case "image":
      // Trigger the image insertion modal
      options?.onImageInsert?.();
      break;

    case "hr":
      return editor.chain().focus().setHorizontalRule().run();
    default:
      console.warn("Invalid command", cmd);
  }
}
