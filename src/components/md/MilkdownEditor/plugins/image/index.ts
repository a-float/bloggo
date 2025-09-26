import { BlobManager } from "@/lib/blob/blob-manager";
import {
  imageBlockComponent,
  imageBlockConfig,
  imageBlockSchema,
  imageBlockView,
  remarkImageBlockPlugin,
} from "@milkdown/components/image-block";
import {
  Editor,
  remarkCtx,
  remarkPluginsCtx,
  remarkStringifyOptionsCtx,
} from "@milkdown/kit/core";
import { FaImage, FaRegComment } from "react-icons/fa6";
import { iconToString } from "../../utils";
import { type Image } from "mdast";
import { imageBlockView as customImageBlockView } from "./image-view";
import { myImageBlockSchema } from "./image-schema";

export function translateImageTags(value: string) {
  return value;
  return value.replaceAll(/(<img.*?>(<\/img>)?)/g, (x) => {
    const template = document.createElement("template");
    template.innerHTML = x;
    const img = template.content.firstChild as HTMLImageElement;
    console.log("real img", img);
    const scale = img.getAttribute("data-scale") || "1.00";
    console.log("got scale", scale);
    const title = img.alt ? ` "${img.alt}"` : "";
    return `![${scale}](${img.getAttribute("src")}${title})`;
  });
}

export function setupImage(editor: Editor) {
  editor.config((ctx) => {
    ctx.update(remarkStringifyOptionsCtx, (prev) => ({
      ...prev,
      handlers: {
        ...prev.handlers,
        image: (node: Image, parent, state, Info) => {
          console.log({ node, parent, state, Info });
          const title = node.title ? ` "${node.title}"` : "";
          if (node.alt === "1.00") {
            return `![${node.title || ""}](${node.url}${title})`;
          }
          return `<img src="${node.url}" ${title ? "alt=" + title : ""} data-scale="${node.alt}">`;
        },
      },
    }));

    // console.log({ remarkCtx });
    // ctx.update(remarkCtx, (prev) => {
    //   return prev.use(remarkGFMPlugin);
    // });

    // ctx.update(remarkPluginsCtx, (prev) => {
    //   console.log("prevs", prev);
    //   return prev;
    // });

    ctx.update(imageBlockConfig.key, (defaultConfig) => ({
      ...defaultConfig,
      imageIcon: iconToString(FaImage),
      captionIcon: iconToString(FaRegComment),
      uploadPlaceholderText: "or paste the image link",
      confirmButton: "Confirm",
      onUpload: (file) => {
        const blobManager = BlobManager.getInstance();
        return Promise.resolve(blobManager.createObjectURL(file));
      },
    }));
  });

  editor.use(
    [
      remarkImageBlockPlugin,
      myImageBlockSchema,
      // imageBlockView,
      customImageBlockView,
      imageBlockConfig,
    ].flat()
  );
}
