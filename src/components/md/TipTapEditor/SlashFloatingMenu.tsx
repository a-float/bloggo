import HeadingIcon from "@/components/HeadingIcon";
import {
  FaListUl,
  FaListOl,
  FaQuoteLeft,
  FaImage,
  FaRulerHorizontal,
} from "react-icons/fa6";
import React from "react";
import clsx from "clsx";
import { executeCommand, insertImage, Command } from "./execute";
import { type Editor } from "@tiptap/react";
import { FloatingMenu } from "@tiptap/react/menus";
import ImageInsertModal from "./ImageInsertModal";

type SlashMenuItem = {
  icon: React.ReactNode;
  label: string;
  command: Command;
};

const menuItemGroups: SlashMenuItem[][] = [
  [
    { icon: <HeadingIcon level={1} />, label: "Heading 1", command: "h1" },
    { icon: <HeadingIcon level={2} />, label: "Heading 2", command: "h2" },
    { icon: <HeadingIcon level={3} />, label: "Heading 3", command: "h3" },
    { icon: <HeadingIcon level={4} />, label: "Heading 4", command: "h4" },
  ],
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

export function SlashFloatingMenu(props: { editor: Editor }) {
  const [activeIdx, setActiveIdx] = React.useState<number>(-1);
  const [show, setShow] = React.useState(false);
  const [showImageModal, setShowImageModal] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const menuItems = menuItemGroups.flat();

  const decrement = () => {
    setActiveIdx((prev) => Math.max(prev - 1, 0));
  };

  const increment = () => {
    setActiveIdx((prev) => Math.min(prev + 1, menuItems.length - 1));
  };

  const executeItem = (itemIdx: number) => {
    const item = menuItems.at(itemIdx);
    if (itemIdx < 0 || !item) return;

    const { editor } = props;
    const { state } = editor;
    const { selection } = state;
    const { $from } = selection;

    // Remove the "/" character before executing the command
    const charBefore = $from.parent.textContent.charAt($from.parentOffset - 1);
    if (charBefore === "/") {
      editor
        .chain()
        .deleteRange({ from: $from.pos - 1, to: $from.pos })
        .run();
    }

    if (item.command === "image") {
      setShowImageModal(true);
      return;
    }

    executeCommand(editor, item.command);
  };

  const handleImageInsert = (src: string, alt?: string) => {
    insertImage(props.editor, src, alt);
    setShowImageModal(false);
  };

  React.useEffect(() => {
    if (!show) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setShow(false);
        setActiveIdx(-1);
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        decrement();
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        increment();
      }
      if (e.key === "Enter") {
        e.preventDefault();
        executeItem(activeIdx);
        setShow(false);
        setActiveIdx(-1);
      }
    };

    document.addEventListener("keydown", handleKeyDown, { capture: true });
    return () => {
      document.removeEventListener("keydown", handleKeyDown, { capture: true });
    };
  }, [activeIdx, show]);

  React.useEffect(() => {
    menuRef.current
      ?.querySelector(`li:nth-child(${activeIdx + 1})`)
      ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [activeIdx]);

  React.useEffect(() => {
    setActiveIdx(-1);
  }, [show]);

  let flatIdx = -1;

  return (
    <>
      <FloatingMenu
        options={{ placement: "bottom-start", offset: 8 }}
        editor={props.editor}
        className={clsx(
          "menu not-prose bg-base-200 rounded-box w-48 max-h-[300px] overflow-auto z-50 shadow-lg",
          !show && "hidden"
        )}
        ref={menuRef}
        shouldShow={({ state }) => {
          const { $from, empty } = state.selection;
          if (!empty) return false;

          const textContent = $from.parent.textContent;
          const shouldShowMenu =
            textContent === "/" && $from.parent.isTextblock;
          if (shouldShowMenu !== show) {
            setShow(shouldShowMenu);
          }
          return shouldShowMenu;
        }}
      >
        <ul>
          {menuItemGroups.map((group, groupIdx) =>
            group.map((item, idx) => {
              flatIdx += 1;
              return (
                <li
                  key={idx}
                  data-cmd={item.command}
                  className={clsx(
                    groupIdx > 0 &&
                      idx === 0 &&
                      "before:content-[''] before:block before:h-px before:my-2 before:bg-base-content/20 before:w-[90%] before:mx-auto"
                  )}
                >
                  <a
                    data-action-idx={flatIdx}
                    className={clsx(flatIdx === activeIdx && "menu-active")}
                    onClick={(e) => {
                      e.preventDefault();
                      executeItem(Number(e.currentTarget.dataset.actionIdx));
                      setShow(false);
                    }}
                  >
                    <div className="w-6 pl-0.5">{item.icon}</div>
                    {item.label}
                  </a>
                </li>
              );
            })
          )}
        </ul>
      </FloatingMenu>

      <ImageInsertModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        onInsert={handleImageInsert}
      />
    </>
  );
}
