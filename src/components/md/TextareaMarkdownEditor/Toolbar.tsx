import { FaBold, FaItalic, FaCode } from "react-icons/fa6";
import { EditorProps } from "../MarkdownEditor";

type EditorAction = "bold" | "italic" | "code";

type EditorActionButton = {
  icon: React.ReactNode;
  action: EditorAction;
};

const editorActionButtons: EditorActionButton[] = [
  { icon: <FaBold />, action: "bold" },
  { icon: <FaItalic />, action: "italic" },
  { icon: <FaCode />, action: "code" },
];

export function Toolbar(props: {
  onChange: EditorProps["onChange"];
  textarea: HTMLTextAreaElement | null;
}) {
  /**
   * Adjusts selection range by trimming spaces.
   */
  const getValidRange = (
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

  const createClickHandler = (action: EditorAction) => () => {
    if (!props.textarea) return;

    const textarea = props.textarea;
    const { start, end } = getValidRange(textarea);
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
    }

    textarea.setRangeText(newText, start, end, "select");
    props.onChange?.(textarea.value);
  };

  const cls = "btn btn-soft btn-square btn-xs";

  return (
    <div className="flex items-center gap-2">
      {editorActionButtons.map((btn) => (
        <button
          key={btn.action}
          className={cls}
          type="button"
          onClick={createClickHandler(btn.action)}
        >
          {btn.icon}
        </button>
      ))}
    </div>
  );
}
