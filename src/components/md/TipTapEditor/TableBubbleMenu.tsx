import { Editor, findParentNode, posToDOMRect } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import clsx from "clsx";
import React from "react";
import {
  TbColumnInsertLeft,
  TbColumnRemove,
  TbRowInsertBottom,
  TbRowRemove,
  TbTableColumn,
  TbTableRow,
  TbTrash,
} from "react-icons/tb";

const getTableCommands = (editor: Editor) => ({
  addColumnBefore() {
    editor.chain().focus().addColumnBefore().run();
  },
  addColumnAfter() {
    editor.chain().focus().addColumnAfter().run();
  },
  deleteColumn() {
    editor.chain().focus().deleteColumn().run();
  },
  addRowBefore() {
    editor.chain().focus().addRowBefore().run();
  },
  addRowAfter() {
    editor.chain().focus().addRowAfter().run();
  },
  deleteRow() {
    editor.chain().focus().deleteRow().run();
  },
  toggleHeaderColumn() {
    editor.chain().focus().toggleHeaderColumn().run();
  },
  toggleHeaderRow() {
    editor.chain().focus().toggleHeaderRow().run();
  },
  toggleHeaderCell() {
    editor.chain().focus().toggleHeaderCell().run();
  },
  mergeCells() {
    editor.chain().focus().mergeCells().run();
  },
  splitCell() {
    editor.chain().focus().splitCell().run();
  },
  deleteTable() {
    editor.chain().focus().deleteTable().run();
  },
});

export default function TableBubbleMenu({ editor }: { editor: Editor }) {
  const tableCommands = getTableCommands(editor);

  const buttonGroups: {
    label: string;
    action: () => void;
    icon: React.ReactNode;
  }[][] = [
    [
      {
        label: "Add Column Before",
        action: tableCommands.addColumnBefore,
        icon: <TbColumnInsertLeft />,
      },
      {
        label: "Add Column After",
        action: tableCommands.addColumnAfter,
        icon: <TbColumnInsertLeft className="rotate-180" />,
      },
      {
        label: "Delete Column",
        action: tableCommands.deleteColumn,
        icon: <TbColumnRemove />,
      },
    ],
    [
      {
        label: "Add Row Before",
        action: tableCommands.addRowBefore,
        icon: <TbRowInsertBottom />,
      },
      {
        label: "Add Row After",
        action: tableCommands.addRowAfter,
        icon: <TbRowInsertBottom className="rotate-180" />,
      },
      {
        label: "Delete Row",
        action: tableCommands.deleteRow,
        icon: <TbRowRemove />,
      },
    ],
    [
      {
        label: "Toggle Header Column",
        action: tableCommands.toggleHeaderColumn,
        icon: <TbTableColumn />,
      },
      {
        label: "Toggle Header Row",
        action: tableCommands.toggleHeaderRow,
        icon: <TbTableRow />,
      },
      {
        label: "Delete Table",
        action: tableCommands.deleteTable,
        icon: <TbTrash />,
      },
    ],
  ];

  return (
    <BubbleMenu
      editor={editor}
      options={{ placement: "top", offset: 8, flip: true }}
      className="z-50 bg-base-200 p-1 shadow-md rounded"
      pluginKey="table-bubble-menu"
      getReferencedVirtualElement={() => {
        // example from https://tiptap.dev/docs/editor/extensions/functionality/bubble-menu
        const parentNode = findParentNode((node) => node.type.name === "table")(
          editor.state.selection
        );
        if (!parentNode) return null;
        const domRect = posToDOMRect(
          editor.view,
          parentNode.start,
          parentNode.start + parentNode.node.nodeSize
        );
        return {
          getBoundingClientRect: () => domRect,
          getClientRects: () => [domRect],
        };
      }}
      shouldShow={({ editor }) =>
        editor.isActive("table") ||
        editor.isActive("tableCell") ||
        editor.isActive("tableHeader") ||
        editor.isActive("tableRow")
      }
    >
      <div className="flex gap-1">
        {buttonGroups.map((group) => (
          <div
            className="[&:not(:first-child)]:border-l pl-1 border-base-content/20"
            key={group[0].label}
          >
            {group.map((btn) => (
              <div className="tooltip" data-tip={btn.label} key={btn.label}>
                <button
                  type="button"
                  onClick={btn.action}
                  className={clsx(
                    "btn btn-soft btn-xs btn-square m-1",
                    btn.action === tableCommands.deleteTable && "btn-error"
                  )}
                >
                  {btn.icon}
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </BubbleMenu>
  );
}
