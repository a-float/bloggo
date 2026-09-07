import type { Editor } from "@tiptap/react";
import { FloatingMenu } from "@tiptap/react/menus";
import clsx from "clsx";
import React from "react";
import {
  FaImage,
  FaListOl,
  FaListUl,
  FaQuoteLeft,
  FaRulerHorizontal,
  FaTable,
} from "react-icons/fa6";
import HeadingIcon from "@/components/HeadingIcon";
import { type Command, executeCommand, insertImage } from "./execute";
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
    { label: "Table", icon: <FaTable />, command: "table" },
    { label: "Quote", icon: <FaQuoteLeft />, command: "quote" },
    { label: "Image", icon: <FaImage />, command: "image" },
    { label: "Divider", icon: <FaRulerHorizontal />, command: "hr" },
  ],
];

export function SlashFloatingMenu({ editor }: { editor: Editor }) {
  const [activeIdx, setActiveIdx] = React.useState<number>(-1);
  const [show, setShow] = React.useState(false);
  const [showImageModal, setShowImageModal] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const menuItems = menuItemGroups.flat();

  const decrement = React.useCallback(() => {
    setActiveIdx((prev) => Math.max(prev - 1, 0));
  }, []);

  const increment = React.useCallback(() => {
    setActiveIdx((prev) => Math.min(prev + 1, menuItems.length - 1));
  }, [menuItems.length]);

  const executeItem = React.useCallback(
    (itemIdx: number) => {
      const item = menuItems.at(itemIdx);
      if (itemIdx < 0 || !item) return;

      const { $from } = editor.state.selection;

      // Remove the "/" character before executing the command
      const charBefore = $from.parent.textContent.charAt(
        $from.parentOffset - 1,
      );
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
    },
    [menuItems, editor],
  );

  const handleImageInsert = (src: string, alt?: string) => {
    insertImage(editor, src, alt);
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
  }, [activeIdx, show, decrement, increment, executeItem]);

  React.useEffect(() => {
    menuRef.current
      ?.querySelector(`li:nth-child(${activeIdx + 1})`)
      ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [activeIdx]);

  React.useEffect(() => {
    setActiveIdx(-1);
  }, []);

  let flatIdx = -1;

  return (
    <>
      <FloatingMenu
        appendTo={document.body} // fix z-index overlap with inputs
        options={{ placement: "bottom-start", offset: 8 }}
        editor={editor}
        className={clsx(
          "menu not-prose bg-base-200 rounded-box w-48 max-h-[300px] overflow-auto shadow-lg",
          !show && "hidden",
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
                      "before:content-[''] before:block before:h-px before:my-2 before:bg-base-content/20 before:w-[90%] before:mx-auto",
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
            }),
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
