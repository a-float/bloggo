import { Ctx } from "@milkdown/kit/ctx";
import { Editor } from "@milkdown/kit/core";
import { tableBlock, tableBlockConfig } from "@milkdown/components/table-block";
import {
  FaPlus,
  FaTrash,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaGripLines,
  FaGripLinesVertical,
} from "react-icons/fa6";
import { iconToString } from "../../utils";

const configureTablePlugin = (ctx: Ctx) => {
  ctx.update(tableBlockConfig.key, (defaultConfig) => ({
    ...defaultConfig,
    renderButton: (renderType) => {
      switch (renderType) {
        case "add_row":
          return iconToString(FaPlus);
        case "add_col":
          return iconToString(FaPlus);
        case "delete_row":
          return iconToString(FaTrash);
        case "delete_col":
          return iconToString(FaTrash);
        case "align_col_left":
          return iconToString(FaAlignLeft);
        case "align_col_center":
          return iconToString(FaAlignCenter);
        case "align_col_right":
          return iconToString(FaAlignRight);
        case "col_drag_handle":
          return iconToString(FaGripLines);
        case "row_drag_handle":
          return iconToString(FaGripLinesVertical);
      }
    },
  }));
};

export function setupTable(editor: Editor) {
  editor.config(configureTablePlugin).use(tableBlock);
}
