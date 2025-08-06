import { Ctx } from "@milkdown/kit/ctx";
import { tooltipFactory, TooltipProvider } from "@milkdown/kit/plugin/tooltip";
import { FaBold, FaCode, FaItalic, FaStrikethrough } from "react-icons/fa6";
import { iconToString } from "../../utils";
import { commandsCtx, Editor } from "@milkdown/core";
import {
  toggleEmphasisCommand,
  toggleInlineCodeCommand,
  toggleStrongCommand,
} from "@milkdown/kit/preset/commonmark";
import { toggleStrikethroughCommand } from "@milkdown/kit/preset/gfm";
import { TextSelection } from "@milkdown/kit/prose/state";

const items = [
  { icon: FaBold, label: "Bold", cmd: "bold" },
  { icon: FaItalic, label: "Italic", cmd: "italic" },
  { icon: FaCode, label: "Inline code", cmd: "code" },
  { icon: FaStrikethrough, label: "Strikethrough", cmd: "strike" },
];

function tooltipProvider(ctx: Ctx) {
  const content = document.createElement("div");
  content.className =
    "milkdown-tooltip absolute data-[show=false]:hidden not-prose";
  let innerHtml = "";
  innerHtml += `<ul class="menu menu-horizontal gap-2 bg-base-200 rounded-box">`;
  for (const item of items) {
    innerHtml += `<li><a class="tooltip btn btn-square btn-soft btn-xs" data-tip="${item.label}" data-cmd="${item.cmd}">${iconToString(item.icon)}</a></li>`;
  }
  innerHtml += "</ul>";
  content.innerHTML = innerHtml;

  const provider = new TooltipProvider({
    content,
    offset: 8,
    shouldShow(view) {
      const { doc, selection } = view.state;
      const { empty, from, to } = selection;

      const isEmptyTextBlock =
        !doc.textBetween(from, to).length && selection instanceof TextSelection;

      const isNotTextBlock = !(selection instanceof TextSelection);

      const activeElement = (view.dom.getRootNode() as ShadowRoot | Document)
        .activeElement;
      const isTooltipChildren = content.contains(activeElement);

      const notHasFocus = !view.hasFocus() && !isTooltipChildren;

      const isReadonly = !view.editable;

      if (
        notHasFocus ||
        isNotTextBlock ||
        empty ||
        isEmptyTextBlock ||
        isReadonly
      )
        return false;

      return true;
    },
  });

  content.querySelectorAll("a[data-cmd]").forEach((anchor) => {
    anchor?.addEventListener("click", (e) => {
      e.preventDefault();
      const commands = ctx.get(commandsCtx);

      const cmd = (e.currentTarget as HTMLElement).dataset.cmd;
      if (cmd === "italic") {
        commands.call(toggleEmphasisCommand.key);
      }
      if (cmd === "bold") {
        commands.call(toggleStrongCommand.key);
      }
      if (cmd === "code") {
        commands.call(toggleInlineCodeCommand.key);
      }
      if (cmd === "strike") {
        commands.call(toggleStrikethroughCommand.key);
      }
    });
  });

  return provider;
}

const tooltip = tooltipFactory("my-tooltip");

export function setupTooltip(editor: Editor) {
  editor.config((ctx) =>
    ctx.set(tooltip.key, { view: () => tooltipProvider(ctx) })
  );
  editor.use(tooltip);
}
