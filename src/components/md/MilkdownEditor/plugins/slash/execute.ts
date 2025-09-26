import { commandsCtx } from "@milkdown/kit/core";
import { Ctx } from "@milkdown/kit/ctx";
import { imageBlockSchema } from "@milkdown/components/image-block";
import {
  addBlockTypeCommand,
  headingSchema,
  clearTextInCurrentBlockCommand,
  setBlockTypeCommand,
  bulletListSchema,
  wrapInBlockTypeCommand,
  orderedListSchema,
  blockquoteSchema,
  hrSchema,
} from "@milkdown/kit/preset/commonmark";

export function executeCommand(ctx: Ctx, cmd: string) {
  const commands = ctx.get(commandsCtx);

  if (["h1", "h2", "h3", "h4"].includes(cmd)) {
    const level = parseInt(cmd.replace("h", ""), 10);
    const heading = headingSchema.type(ctx);

    commands.call(clearTextInCurrentBlockCommand.key);
    commands.call(setBlockTypeCommand.key, {
      nodeType: heading,
      attrs: { level },
    });
  }

  if (cmd === "bullet") {
    const bulletList = bulletListSchema.type(ctx);

    commands.call(clearTextInCurrentBlockCommand.key);
    commands.call(wrapInBlockTypeCommand.key, {
      nodeType: bulletList,
    });
  }

  if (cmd === "ordered") {
    const orderedList = orderedListSchema.type(ctx);

    commands.call(clearTextInCurrentBlockCommand.key);
    commands.call(wrapInBlockTypeCommand.key, {
      nodeType: orderedList,
    });
  }

  if (cmd === "quote") {
    const blockquote = blockquoteSchema.type(ctx);

    commands.call(clearTextInCurrentBlockCommand.key);
    commands.call(wrapInBlockTypeCommand.key, {
      nodeType: blockquote,
    });
  }

  if (cmd === "image") {
    const imageBlock = imageBlockSchema.type(ctx);

    commands.call(clearTextInCurrentBlockCommand.key);
    commands.call(addBlockTypeCommand.key, {
      nodeType: imageBlock,
    });
  }

  if (cmd === "hr") {
    const hr = hrSchema.type(ctx);

    commands.call(clearTextInCurrentBlockCommand.key);
    commands.call(wrapInBlockTypeCommand.key, {
      nodeType: hr,
    });
  }
}
