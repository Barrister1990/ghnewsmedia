import { Node, mergeAttributes } from '@tiptap/core';

export interface IframeOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    iframe: {
      setIframe: (attributes: { src: string; width?: string; height?: string; title?: string }) => ReturnType;
    };
  }
}

export const Iframe = Node.create<IframeOptions>({
  name: 'iframe',

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'max-w-full h-auto rounded-lg shadow-sm border border-gray-200',
      },
    };
  },

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: element => element.getAttribute('src'),
        renderHTML: attributes => {
          if (!attributes.src) {
            return {};
          }
          return {
            src: attributes.src,
          };
        },
      },
      width: {
        default: '560',
        parseHTML: element => element.getAttribute('width'),
        renderHTML: attributes => {
          if (!attributes.width) {
            return {};
          }
          return {
            width: attributes.width,
          };
        },
      },
      height: {
        default: '315',
        parseHTML: element => element.getAttribute('height'),
        renderHTML: attributes => {
          if (!attributes.height) {
            return {};
          }
          return {
            height: attributes.height,
          };
        },
      },
      title: {
        default: 'Embedded content',
        parseHTML: element => element.getAttribute('title'),
        renderHTML: attributes => {
          if (!attributes.title) {
            return {};
          }
          return {
            title: attributes.title,
          };
        },
      },
      frameborder: {
        default: '0',
        parseHTML: element => element.getAttribute('frameborder'),
        renderHTML: attributes => {
          if (!attributes.frameborder) {
            return {};
          }
          return {
            frameborder: attributes.frameborder,
          };
        },
      },
      allowfullscreen: {
        default: true,
        parseHTML: element => element.hasAttribute('allowfullscreen'),
        renderHTML: attributes => {
          if (!attributes.allowfullscreen) {
            return {};
          }
          return {
            allowfullscreen: 'true',
          };
        },
      },
      allow: {
        default: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
        parseHTML: element => element.getAttribute('allow'),
        renderHTML: attributes => {
          if (!attributes.allow) {
            return {};
          }
          return {
            allow: attributes.allow,
          };
        },
      },
      referrerpolicy: {
        default: 'strict-origin-when-cross-origin',
        parseHTML: element => element.getAttribute('referrerpolicy'),
        renderHTML: attributes => {
          if (!attributes.referrerpolicy) {
            return {};
          }
          return {
            referrerpolicy: attributes.referrerpolicy,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'iframe',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { width, height } = HTMLAttributes;
    const aspectRatio = height && width ? (parseInt(height) / parseInt(width)) * 100 : 56.25;

    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, {
        class: 'my-4',
      }),
      [
        'div',
        {
          class: 'relative w-full',
          style: `padding-bottom: ${aspectRatio}%`,
        },
        [
          'iframe',
          mergeAttributes(HTMLAttributes, {
            class: 'absolute top-0 left-0 w-full h-full rounded-lg border border-gray-200 shadow-sm',
          }),
        ],
      ],
      [
        'div',
        {
          class: 'mt-2 text-xs text-gray-500 text-center',
        },
        `Embedded content from: ${new URL(HTMLAttributes.src || '').hostname}`,
      ],
    ];
  },

  addCommands() {
    return {
      setIframe:
        attributes =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: attributes,
          });
        },
    };
  },
});
