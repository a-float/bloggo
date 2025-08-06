import { IconType } from "react-icons/lib";
import type { Selection } from "@milkdown/kit/prose/state";

export const iconToString = (Icon: IconType): string => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const props = (Icon as any)().props;
  const viewBox: string = props.attr.viewBox;
  const d: string = props.children[0].props.d;
  return `<svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="${viewBox}"
    >
      <g><path d="${d}"/></g>
    </svg>`;
};

export function isInCodeBlock(selection: Selection) {
  const type = selection.$from.parent.type;
  return type.name === "code_block";
}

export function isInList(selection: Selection) {
  const type = selection.$from.node(selection.$from.depth - 1)?.type;
  return type?.name === "list_item";
}
