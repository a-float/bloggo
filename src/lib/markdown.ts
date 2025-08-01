import { micromark } from "micromark";
import { gfm, gfmHtml } from "micromark-extension-gfm";

export function markdownToHtml(
  markdown: string,
  options?: { trusted: boolean }
) {
  return micromark(markdown, {
    extensions: [gfm()],
    htmlExtensions: [gfmHtml()],
    allowDangerousProtocol: !!options?.trusted,
    allowDangerousHtml: !!options?.trusted,
  });
}
