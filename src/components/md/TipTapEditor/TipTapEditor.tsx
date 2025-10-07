import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React from "react";
import { EditorProps } from "../MarkdownEditor";
import { Markdown } from "tiptap-markdown";
import { TableKit } from "@tiptap/extension-table";
import { Image } from "@tiptap/extension-image";
import { MyFloatingMenu } from "./FloatingMenu";
import MyBubbleMenu from "./BubbleMenu";

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
      Image,
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
  }, [props.disabled]);

  if (!editor?.isInitialized) {
    return <div className="skeleton h-[50vh] w-full"></div>;
  }

  return (
    <div className="p-2 flex flex-col gap-4">
      {editor && (
        <>
          <MyBubbleMenu editor={editor} />
          <MyFloatingMenu editor={editor} />
        </>
      )}
      <EditorContent
        editor={editor}
        className="prose [&>*]:p-2 [&>*]:outline-none"
      />
    </div>
  );
}
