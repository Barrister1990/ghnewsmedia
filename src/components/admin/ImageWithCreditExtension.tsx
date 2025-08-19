import { Node, mergeAttributes } from '@tiptap/core';

export interface ImageWithCreditOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageWithCredit: {
      setImageWithCredit: (attributes: { 
        src: string; 
        alt?: string; 
        credit?: string;
        title?: string;
        width?: string;
        height?: string;
      }) => ReturnType;
    };
  }
}

export const ImageWithCredit = Node.create<ImageWithCreditOptions>({
  name: 'imageWithCredit',

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
      alt: {
        default: null,
        parseHTML: element => element.getAttribute('alt'),
        renderHTML: attributes => {
          if (!attributes.alt) {
            return {};
          }
          return {
            alt: attributes.alt,
          };
        },
      },
      credit: {
        default: null,
        parseHTML: element => element.getAttribute('data-credit'),
        renderHTML: attributes => {
          if (!attributes.credit) {
            return {};
          }
          return {
            'data-credit': attributes.credit,
          };
        },
      },
      title: {
        default: null,
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
      width: {
        default: null,
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
        default: null,
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
    };
  },

  parseHTML() {
    return [
      {
        tag: 'img',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { src, alt, credit, title, width, height } = HTMLAttributes;

    // Build the DOM structure
    const children: any[] = [
      [
        'img',
        mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
          src,
          alt: alt || 'Image',
          title: title || alt || 'Image',
          width: width || 'auto',
          height: height || 'auto',
        }),
      ],
    ];

    // Add credit attribution if it exists
    if (credit) {
      children.push([
        'div',
        {
          class: 'mt-2 text-xs text-gray-500 text-center italic',
        },
        [
          'span',
          {
            class: 'text-gray-600 font-medium',
          },
          'Credit: ',
        ],
        credit,
      ]);
    }

    // Return the properly structured DOMOutputSpec
    return [
      'div',
      {
        class: 'my-4',
      },
      ...children,
    ];
  },

  addCommands() {
    return {
      setImageWithCredit:
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
