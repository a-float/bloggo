import React from "react";
import clsx from "clsx";
import { menuItemGroups } from "./config";
import { executeCommand } from "./execute";
import { Ctx } from "@milkdown/kit/ctx";

export const MenuApp = (props: {
  ctx: Ctx;
  ref: React.Ref<{ setShow: (value: boolean) => void }>;
}) => {
  const [activeIdx, setActiveIdx] = React.useState<number>(-1);
  const [show, setShow] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const menuItems = menuItemGroups.flat();

  React.useImperativeHandle(props.ref, () => ({
    setShow: setShow,
  }));

  const decrement = () => {
    setActiveIdx((prev) => Math.max(prev - 1, 0));
  };

  const increment = () => {
    setActiveIdx((prev) => Math.min(prev + 1, menuItems.length - 1));
  };

  const executeItem = (itemIdx: number) => {
    const item = menuItems.at(itemIdx);
    if (!item) return;
    executeCommand(props.ctx, item.command);
  };

  React.useEffect(() => {
    if (!show) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setShow(false);
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
      }
    };
    // capture: true prevents newline insertion in the editor
    document.addEventListener("keydown", handleKeyDown, { capture: true });
    return () => {
      document.removeEventListener("keydown", handleKeyDown, { capture: true });
    };
  }, [increment, decrement, executeItem, props.ctx]);

  React.useEffect(() => {
    menuRef.current
      ?.querySelector(`li:nth-child(${activeIdx + 1})`)
      ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [activeIdx]);

  if (!show) return null;

  let flatIdx = -1;

  return (
    <div
      className="menu not-prose bg-base-200 rounded-box w-42 max-h-[300px] overflow-auto"
      ref={menuRef}
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
                  className={clsx(flatIdx === activeIdx && "menu-active")}
                  onClick={() => executeItem(idx)}
                >
                  <div className="w-6 pl-0.5">{item.icon}</div>
                  {item.label}
                </a>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
};
