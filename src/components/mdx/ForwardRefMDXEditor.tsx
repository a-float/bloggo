"use client";

import dynamic from "next/dynamic";
import { forwardRef, Suspense } from "react";
import { type MDXEditorMethods, type MDXEditorProps } from "@mdxeditor/editor";

const Editor = dynamic(() => import("./InitializedMDXEditor"), {
  ssr: false,
  loading: () => (
    <div className="bg-base-200 rounded-lg" style={{ minHeight: 480 }}>
      <div className="bg-slate-100 rounded-lg" style={{ minHeight: 40 }} />
    </div>
  ),
});

export const ForwardRefMDXEditor = forwardRef<MDXEditorMethods, MDXEditorProps>(
  (props, ref) => (
    <Suspense fallback="banana">
      <Editor {...props} editorRef={ref} />
    </Suspense>
  )
);

ForwardRefMDXEditor.displayName = "ForwardRefMDXEditor";
