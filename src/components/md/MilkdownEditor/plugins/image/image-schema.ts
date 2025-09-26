import { expectDomTypeError } from "@milkdown/exception";
import { $nodeSchema } from "@milkdown/utils";

export const IMAGE_DATA_TYPE = "image-block";

export const myImageBlockSchema = $nodeSchema("image-block", () => {
  return {
    inline: false,
    group: "block",
    selectable: true,
    draggable: true,
    isolating: true,
    marks: "",
    atom: true,
    priority: 100,
    attrs: {
      src: { default: "", validate: "string" },
      caption: { default: "", validate: "string" },
      width: { default: "auto", validate: "string" },
    },
    parseDOM: [
      {
        tag: `img[data-type="${IMAGE_DATA_TYPE}"]`,
        getAttrs: (dom) => {
          if (!(dom instanceof HTMLElement)) throw expectDomTypeError(dom);

          return {
            src: dom.getAttribute("src") || "",
            alt: dom.getAttribute("alt") || "",
            width: dom.getAttribute("width") || "auto",
          };
        },
      },
    ],
    toDOM: (node) => ["img", { "data-type": IMAGE_DATA_TYPE, ...node.attrs }],
    parseMarkdown: {
      match: ({ type, ...rest }) => {
        console.log({ type, rest });
        return type === "image-block";
      },
      runner: (state, node, type) => {
        console.log("parseMarkdown", node);
        const src = node.url as string;
        const caption = node.title as string;
        let ratio = Number((node.alt as string) || 1);
        if (Number.isNaN(ratio) || ratio === 0) ratio = 1;

        state.addNode(type, {
          src,
          caption,
          ratio,
        });
      },
    },
    toMarkdown: {
      match: (node) => node.type.name === "image-block",
      runner: (state, node) => {
        console.log("to markdown", node);
        state.openNode("paragraph");
        state.addNode("image", undefined, undefined, {
          title: node.attrs.caption,
          url: node.attrs.src,
          alt: `${Number.parseFloat(node.attrs.ratio).toFixed(2)}`,
        });
        state.closeNode();
      },
    },
  };
});

// withMeta(imageBlockSchema.node, {
//   displayName: "NodeSchema<image-block>",
//   group: "ImageBlock",
// });
