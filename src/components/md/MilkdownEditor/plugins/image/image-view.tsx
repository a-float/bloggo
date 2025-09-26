import type { NodeViewConstructor } from "@milkdown/prose/view";
import { createRoot } from "react-dom/client";
import { $view } from "@milkdown/utils";
import {
  imageBlockSchema,
  imageBlockConfig,
} from "@milkdown/components/image-block";
import { ImageBlockApp } from "./image-component";
import DOMPurify from "dompurify";

export const imageBlockView = $view(
  imageBlockSchema.node,
  (ctx): NodeViewConstructor => {
    return (initialNode, view, getPos) => {
      console.log({ initialNode });
      const src = initialNode.attrs.src;
      const alt = initialNode.attrs.caption; // why not alt?
      const scale = initialNode.attrs.ratio;
      console.log({ initialNode });
      // const caption = initialNode.attrs.caption;
      // const ratio = initialNode.attrs.ratio;
      const config = ctx.get(imageBlockConfig.key);
      const dom = document.createElement("div");
      dom.className = "milkdown-image-block";

      const setAttr = (attr: string, value: unknown) => {
        if (!view.editable) return;
        const pos = getPos();
        if (pos == null) return;
        view.dispatch(
          view.state.tr.setNodeAttribute(
            pos,
            attr,
            attr === "src" ? DOMPurify.sanitize(value as string) : value
          )
        );
      };

      const root = createRoot(dom);
      root.render(
        <ImageBlockApp
          attrs={{ src, alt, scale }}
          config={config}
          setAttr={setAttr}
        />
      );

      return {
        dom,
        update: (updatedNode) => {
          if (updatedNode.type !== initialNode.type) return false;
          console.log("updatedNode", updatedNode);
          return true;
        },
        stopEvent: (e) => {
          if (e.target instanceof HTMLInputElement) return true;
          return false;
        },
        selectNode: () => {
          dom.classList.add("selected");
        },
        deselectNode: () => {
          dom.classList.remove("selected");
        },
        destroy: () => {
          setTimeout(() => {
            root.unmount();
            dom.remove();
          });
        },
      };
    };
  }
);
