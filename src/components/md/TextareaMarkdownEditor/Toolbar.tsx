"use client";

import {
  FaBold,
  FaItalic,
  FaCode,
  FaImage,
  FaHeading,
  FaQuoteLeft,
  FaListOl,
  FaListUl,
  FaLink,
} from "react-icons/fa6";
import { EditorProps } from "../MarkdownEditor";
import React from "react";
import { BlobManager } from "@/lib/blob/blob-manager";
import { ToolbarItem } from "./ToolbarItem";
import HeadingIcon from "@/components/HeadingIcon";

type HeadingLevel = 1 | 2 | 3 | 4;

export type EditorAction =
  | "bold"
  | "italic"
  | "code"
  | "image"
  | "quote"
  | "link"
  | "ul"
  | "ol"
  | `h${HeadingLevel}`;

export type ToolbarSubAction = {
  icon: React.ReactNode;
  label: string;
  action: EditorAction;
};

export type ToolbarAction = {
  icon: React.ReactNode;
  tip: string;
} & (
  | { action?: never; children: ToolbarSubAction[] }
  | { action: EditorAction; children?: never }
);

const toolbarActionGroups: ToolbarAction[][] = [
  [
    {
      icon: <FaHeading />,
      tip: "Headings",
      children: [
        { icon: <HeadingIcon level={1} />, label: "Heading 1", action: "h1" },
        {
          icon: <HeadingIcon level={2} />,
          label: "Heading 2",
          action: "h2",
        },
        {
          icon: <HeadingIcon level={3} />,
          label: "Heading 3",
          action: "h3",
        },
        {
          icon: <HeadingIcon level={4} />,
          label: "Heading 4",
          action: "h4",
        },
      ],
    },
    { icon: <FaBold />, action: "bold", tip: "Bold" },
    { icon: <FaItalic />, action: "italic", tip: "Italic" },
  ],
  [
    { icon: <FaQuoteLeft />, action: "quote", tip: "Quote" },
    { icon: <FaCode />, action: "code", tip: "Code" },
    { icon: <FaImage />, action: "image", tip: "Image" },
  ],
  [
    { icon: <FaListUl />, action: "ul", tip: "Unordered List" },
    { icon: <FaListOl />, action: "ol", tip: "Ordered List" },
    { icon: <FaLink />, action: "link", tip: "Link" },
  ],
];

/**
 * Adjusts selection range by trimming spaces.
 */
const getTrimmedSelection = (
  textarea: HTMLTextAreaElement
): { start: number; end: number } => {
  const text = textarea.value;
  let start = textarea.selectionStart;
  let end = textarea.selectionEnd;

  while (text[start] === " " && start < end - 1) {
    start++;
  }
  while (text[end - 1] === " " && end > start + 1) {
    end--;
  }

  return { start, end };
};

export function Toolbar(props: {
  onChange: EditorProps["onChange"];
  textarea: HTMLTextAreaElement | null;
}) {
  const textarea = props.textarea;
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const blobManagerRef = React.useRef(BlobManager.getInstance());

  const prependSelectedLines = (prefix: string, mode: "all" | "first") => {
    if (!textarea) return;
    let { start, end } = getTrimmedSelection(textarea);
    const value = textarea.value;
    while (start > 0 && value[start - 1] !== "\n") {
      start--;
    }
    while (end < value.length - 1 && value[end] !== "\n") {
      end++;
    }
    const selectedText = value.substring(start, end);
    let newText = "";
    if (mode === "all") {
      let count = 1;
      const replacedText = ("\n" + selectedText).replaceAll(
        "\n",
        () => `\n${prefix.replace("\d", (count++).toString())}`
      );
      newText = `${replacedText}\n`;
    }
    if (mode === "first") {
      newText = prefix + selectedText;
    }
    textarea.setRangeText(newText, start, end, "select");
    props.onChange?.(textarea.value);
    textarea.focus();
  };

  const createClickHandler = (action: EditorAction) => () => {
    if (!textarea) return;

    const { start, end } = getTrimmedSelection(textarea);
    const selectedText = textarea.value.substring(start, end);

    let newText = "";
    switch (action) {
      case "bold":
        newText = `**${selectedText}**`;
        break;
      case "italic":
        newText = `_${selectedText}_`;
        break;
      case "code":
        newText = `\`${selectedText}\``;
        break;
      case "link":
        newText = `[${selectedText || "Link"}](url)`;
        break;
      case "image":
        fileInputRef.current?.click();
        break;
      case "h1":
        return prependSelectedLines("# ", "first");
      case "h2":
        return prependSelectedLines("## ", "first");
      case "h3":
        return prependSelectedLines("### ", "first");
      case "h4":
        return prependSelectedLines("#### ", "first");
      case "quote":
        return prependSelectedLines("> ", "all");
      case "ul":
        return prependSelectedLines("- ", "all");
      case "ol":
        return prependSelectedLines("\d. ", "all");
      default:
        return;
    }

    textarea.setRangeText(newText, start, end, "select");
    props.onChange?.(textarea.value);
    textarea.focus();
  };

  const handleImageUpload = async (
    e: React.SyntheticEvent<HTMLInputElement>
  ) => {
    if (!textarea) return;

    const files = Array.from(e.currentTarget.files ?? []);
    const urls = await Promise.all(
      files.map((file) => blobManagerRef.current.createObjectURL(file))
    );
    const imageMarkdown = urls
      .map((url, idx) => `![${files[idx].name || "Image"}](${url})`)
      .join("\n\n");

    const start = textarea.selectionStart ?? textarea.value.length;

    textarea.setRangeText(imageMarkdown, start, start, "end");
    props.onChange?.(textarea.value);
  };

  return (
    <div className="ml-10 overflow-auto xs:max-w-auto scrollbar-hide">
      <div className="flex gap-2 pb-1.5 items-center">
        {toolbarActionGroups.map((group, groupIdx) => (
          <div
            key={groupIdx}
            className="flex gap-2 border-l-1 border-l-base-content/10 pl-2 first:border-l-0 first:pl-0"
          >
            {group.map((action, idx) => (
              <ToolbarItem
                key={idx}
                action={action}
                createClickHandler={createClickHandler}
              />
            ))}
          </div>
        ))}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        multiple
        onInput={handleImageUpload}
      />
    </div>
  );
}
