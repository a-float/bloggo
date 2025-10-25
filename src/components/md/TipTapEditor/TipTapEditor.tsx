import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React from "react";
import { EditorProps } from "../MarkdownEditor";
import { Markdown } from "tiptap-markdown";
import { TableKit } from "@tiptap/extension-table";
import { Image } from "@tiptap/extension-image";
import { SlashFloatingMenu } from "./SlashFloatingMenu";
import MarkBubbleMenu from "./MarkBubbleMenu";
import TableBubbleMenu from "./TableBubbleMenu";
import ImageBubbleMenu from "./ImageBubbleMenu";

// Added newline so that it doesn't break next element
// Probably breaks images in tables
const ScalableImage = Image.extend({
  addStorage() {
    return {
      markdown: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        serialize(state: any, node: any) {
          const { src, title, width, height } = node.attrs;
          const alt = node.attrs.alt || "";

          if (width || height) {
            state.write(
              `<img src="${src}" alt="${alt}"${title ? ` title="${title}"` : ""}${width ? ` width="${width}"` : ""}${height ? ` height="${height}"` : ""} />\n\n`
            );
          } else if (title) {
            state.write(`![${alt}](${src} "${title}")\n\n`);
          } else {
            state.write(`![${alt}](${src})\n\n`);
          }
        },
      },
    };
  },
});

export default function TipTapEditor(
  props: Omit<EditorProps, "label"> & {
    disabled?: boolean;
  }
) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Markdown,
      TableKit,
      ScalableImage,
      // Placeholder.configure({
      //   placeholder: "Write something or type '/' for commands",
      // }),
    ],
    content: props.value || props.defaultValue || "",
    onUpdate: ({ editor }) => {
      // @ts-expect-error markdown is missing in types
      const markdown = editor.storage.markdown.getMarkdown();
      props.onChange?.(markdown);
    },
  });

  React.useEffect(() => {
    if (!props.disabled) {
      editor?.commands.setContent(props.value || "");
    }
  }, [props.disabled, editor]);

  if (!editor) {
    return <div className="skeleton h-[50vh] w-full"></div>;
  }

  return (
    <div className="p-2 flex flex-col gap-4">
      {editor && (
        <>
          <MarkBubbleMenu editor={editor} />
          <TableBubbleMenu editor={editor} />
          <ImageBubbleMenu editor={editor} />
          <SlashFloatingMenu editor={editor} />
        </>
      )}
      <EditorContent
        editor={editor}
        className="prose [&>*]:p-2 [&>*]:outline-none"
      />
    </div>
  );
}
