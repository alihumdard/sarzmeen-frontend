import { Node, mergeAttributes } from "@tiptap/core";

/**
 * An embedded video, as a node the editor knows about.
 *
 * Without one, inserting an iframe did nothing visible: Tiptap drops any
 * tag its schema has no node for, so the markup went in and vanished,
 * and the post saved without it.
 *
 * Only the src is kept from the document — the rest of the attributes are
 * written fresh on the way out, so nothing a pasted iframe carried can
 * ride along. The server checks the address again regardless.
 */
export const VideoEmbed = Node.create({
  name: "videoEmbed",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      src: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: "iframe[src]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "iframe",
      mergeAttributes(HTMLAttributes, {
        width: "560",
        height: "315",
        frameborder: "0",
        allowfullscreen: "true",
        title: "YouTube video",
      }),
    ];
  },

  /* Shown in the editor itself; the iframe is inert while editing, so a
     click selects the block rather than playing the video. */
  addNodeView() {
    return ({ node }) => {
      const wrapper = document.createElement("div");
      wrapper.className = "relative my-3 overflow-hidden rounded-lg bg-black";
      wrapper.style.aspectRatio = "16 / 9";

      const frame = document.createElement("iframe");
      frame.src = String(node.attrs.src ?? "");
      frame.width = "560";
      frame.height = "315";
      frame.setAttribute("frameborder", "0");
      frame.setAttribute("allowfullscreen", "true");
      frame.title = "YouTube video";
      frame.className = "pointer-events-none h-full w-full";

      wrapper.appendChild(frame);

      return { dom: wrapper };
    };
  },
});

/**
 * The video id out of whatever YouTube link was pasted.
 *
 * Covers watch URLs, share links, embeds, shorts and live, and a bare id
 * — which is what people often copy from the share dialog. Mirrors the
 * reading the API does, so a link the editor accepts is one the server
 * will keep.
 */
export function youtubeId(url: string): string | null {
  const text = url.trim();
  if (text === "") return null;

  const patterns = [
    /youtu\.be\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/watch\?(?:.*&)?v=([A-Za-z0-9_-]{11})/,
    /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/live\/([A-Za-z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1];
  }

  return /^[A-Za-z0-9_-]{11}$/.test(text) ? text : null;
}
