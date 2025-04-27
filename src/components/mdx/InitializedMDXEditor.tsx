"use client";

import type { ForwardedRef } from "react";
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
  toolbarPlugin,
  directivesPlugin,
  AdmonitionDirectiveDescriptor,
  codeBlockPlugin,
  diffSourcePlugin,
  frontmatterPlugin,
  // imagePlugin,
  linkDialogPlugin,
  linkPlugin,
  tablePlugin,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { MDXToolbar } from "./MDXToolbar";
// import { resizeImage } from "@/lib/resizeImage";
// import blobManager from "@/lib/blobManager";

export default function InitializedMDXEditor({
  editorRef,
  ...props
}: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {
  return (
    <MDXEditor
      plugins={[
        toolbarPlugin({ toolbarContents: () => <MDXToolbar /> }),
        listsPlugin(),
        quotePlugin(),
        headingsPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        // imagePlugin({
        //   imageUploadHandler: async (img) => {
        //     const blob = await resizeImage(img, 600, 600);
        //     return blobManager.createObjectURL(blob);
        //   },
        // }),
        tablePlugin(),
        thematicBreakPlugin(),
        frontmatterPlugin(),
        codeBlockPlugin({ defaultCodeBlockLanguage: "txt" }),
        directivesPlugin({
          directiveDescriptors: [AdmonitionDirectiveDescriptor],
        }),
        diffSourcePlugin({ viewMode: "rich-text", diffMarkdown: "boo" }),
        markdownShortcutPlugin(),
      ]}
      {...props}
      ref={editorRef}
    />
  );
}
