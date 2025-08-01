import { IconType } from "react-icons/lib";

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
