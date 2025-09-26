import React from "react";
import { ImageBlockConfig } from "@milkdown/components/image-block";
import { config, prosePluginsCtx } from "@milkdown/kit/core";
import { BlobManager } from "@/lib/blob/blob-manager";

export const ImageBlockApp = (props: {
  attrs: { src: string; alt: string; scale: number };
  config: ImageBlockConfig;
  setAttr: (attr: string, value: string) => void;
}) => {
  const [attrs, setAttrs] = React.useState(props.attrs);
  const blobManager = BlobManager.getInstance();

  console.log("props.attrs", props.attrs);
  if (attrs.src) {
    return (
      <img
        {...attrs}
        style={{ width: Number(props.attrs.scale) * 100 + "%" }}
      />
    );
  }
  const onUploadFile = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    const file = files?.item(0);
    if (!file) {
      return;
    }
    console.log(file);
    const url = blobManager.createObjectURL(file);
    props.setAttr("src", url);
    props.setAttr("alt", file.name);
    setAttrs((p) => ({ ...p, src: url, alt: file.name }));
  };

  return (
    <form
      className="flex items-center gap-2 p-4 bg-base-300"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.target as HTMLFormElement);
        const src = data.get("src") as string;
        props.setAttr("src", src);
        setAttrs((p) => ({ ...p, src }));
      }}
    >
      <label className="btn btn-primary btn-sm">
        <span>{props.config.uploadButton}</span>
        <input
          className="hidden"
          type="file"
          accept="image/*"
          onChange={onUploadFile}
        />
      </label>
      <span>or</span>
      <div className="join">
        <input
          className="input join-item input-sm"
          placeholder={"Specify image URL address"}
          type="text"
          name="src"
        />
        <button className="btn btn-primary btn-sm join-item" type="submit">
          {props.config.confirmButton}
        </button>
      </div>
    </form>
  );
};
