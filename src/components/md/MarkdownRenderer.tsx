import { markdownToHtml } from "@/lib/markdown";

type MarkdownRendererProps = { className?: string } & (
  | { html: string; markdown?: never }
  | { html?: never; markdown: string }
);

export default function MarkdownRenderer(props: MarkdownRendererProps) {
  const content = props.html ?? markdownToHtml(props.markdown);
  return (
    <div
      className={"prose " + (props.className ?? "")}
      style={{ wordWrap: "break-word" }}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
