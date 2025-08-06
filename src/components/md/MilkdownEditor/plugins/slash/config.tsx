import HeadingIcon from "@/components/HeadingIcon";
import {
  FaListUl,
  FaListOl,
  FaQuoteLeft,
  FaImage,
  FaRulerHorizontal,
} from "react-icons/fa6";

type SlashMenuItem = {
  icon: React.ReactNode;
  label: string;
  command: string;
};

export const menuItemGroups: SlashMenuItem[][] = [
  Array.from({ length: 4 }).map((_, i) => ({
    icon: <HeadingIcon level={i + 1} />,
    label: `Heading ${i + 1}`,
    command: `h${i + 1}`,
  })),
  [
    { icon: <FaListUl />, label: "Bullet List", command: "bullet" },
    { icon: <FaListOl />, label: "Ordered List", command: "ordered" },
  ],
  [
    { label: "Quote", icon: <FaQuoteLeft />, command: "quote" },
    { label: "Image", icon: <FaImage />, command: "image" },
    { label: "Divider", icon: <FaRulerHorizontal />, command: "hr" },
  ],
];
