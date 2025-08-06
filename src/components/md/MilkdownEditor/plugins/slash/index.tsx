import React from "react";
import { Ctx } from "@milkdown/kit/ctx";
import { SlashProvider, slashFactory } from "@milkdown/plugin-slash";
import { PluginView } from "@milkdown/kit/prose/state";
import { EditorView } from "@milkdown/kit/prose/view";
import { createRoot } from "react-dom/client";
import { MenuApp } from "./component";
import { isInCodeBlock, isInList } from "../../utils";
import { Editor } from "@milkdown/kit/core";

class MenuView implements PluginView {
  readonly #content: HTMLElement;
  readonly #root: ReturnType<typeof createRoot>;
  readonly #slashProvider: SlashProvider;

  constructor(ctx: Ctx) {
    this.#content = document.createElement("div");
    this.#content.className = "slash-menu";
    this.#root = createRoot(this.#content);
    const ref = React.createRef<{ setShow: (value: boolean) => void }>();

    // Creating a small react app, but maybe some pure JS would have been enough.
    this.#root.render(<MenuApp ctx={ctx} ref={ref} />);

    const provider: SlashProvider = new SlashProvider({
      content: this.#content,
      shouldShow(view) {
        if (
          isInCodeBlock(view.state.selection) ||
          isInList(view.state.selection)
        ) {
          return false;
        }
        if (!provider.getContent(view)?.endsWith("/")) {
          return false;
        }
        return true;
      },
      // TODO change menu position? Maybe center
      offset: 8,
    });

    this.#slashProvider = provider;

    this.#slashProvider.onShow = () => {
      ref.current?.setShow(true);
    };
    this.#slashProvider.onHide = () => {
      ref.current?.setShow(false);
    };
  }

  update = (view: EditorView) => {
    this.#slashProvider.update(view);
  };

  show = () => {
    this.#slashProvider.show();
  };

  hide = () => {
    this.#slashProvider.hide();
  };

  destroy = () => {
    this.#slashProvider.destroy();
    this.#root.unmount();
    this.#content.remove();
  };
}

const slash = slashFactory("slash_menu");

export function setupSlashMenu(editor: Editor) {
  editor
    .config((ctx) => ctx.set(slash.key, { view: () => new MenuView(ctx) }))
    .use(slash);
}
