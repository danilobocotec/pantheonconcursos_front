import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import { TextStyle } from '@tiptap/extension-text-style';
import { FontFamily } from '@tiptap/extension-font-family';
import { Extension } from '@tiptap/core';
import {
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Image as ImageIcon,
  Video,
  List,
  ListOrdered,
  Music,
  Type,
  ChevronsUpDown,
  Quote
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

// Extensão customizada para tamanho de fonte
const FontSize = Extension.create({
  name: 'fontSize',

  addOptions() {
    return {
      types: ['textStyle'],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => element.style.fontSize.replace(/['"]+/g, ''),
            renderHTML: attributes => {
              if (!attributes.fontSize) {
                return {};
              }
              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize: (fontSize: string) => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontSize })
          .run();
      },
      unsetFontSize: () => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontSize: null })
          .removeEmptyTextStyle()
          .run();
      },
    };
  },
});

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const [showFontSizeMenu, setShowFontSizeMenu] = useState(false);
  const [showFontFamilyMenu, setShowFontFamilyMenu] = useState(false);

  const fontSizes = [
    { label: 'Muito pequeno', value: '10px' },
    { label: 'Pequeno', value: '12px' },
    { label: 'Normal', value: '14px' },
    { label: 'Médio', value: '16px' },
    { label: 'Grande', value: '18px' },
    { label: 'Muito grande', value: '24px' },
    { label: 'Enorme', value: '32px' },
  ];

  const fontFamilies = [
    { label: 'Padrão', value: 'inherit' },
    { label: 'Arial', value: 'Arial, sans-serif' },
    { label: 'Times New Roman', value: 'Times New Roman, serif' },
    { label: 'Courier New', value: 'Courier New, monospace' },
    { label: 'Georgia', value: 'Georgia, serif' },
    { label: 'Verdana', value: 'Verdana, sans-serif' },
    { label: 'Comic Sans', value: 'Comic Sans MS, cursive' },
  ];

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      FontSize,
      FontFamily,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Youtube.configure({
        controls: true,
        nocookie: true,
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const addImage = useCallback(() => {
    const url = window.prompt('URL da imagem:');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const addVideo = useCallback(() => {
    const url = window.prompt('URL do YouTube:');
    if (url && editor) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  }, [editor]);

  const addAudioLink = useCallback(() => {
    const url = window.prompt('URL do áudio:');
    if (url && editor) {
      const text = window.prompt('Texto do link:', 'Ouvir áudio');
      if (text) {
        editor.chain().focus().setLink({ href: url }).insertContent(text).run();
      }
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1 items-center">
        {/* Tamanho de fonte */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowFontSizeMenu(!showFontSizeMenu);
              setShowFontFamilyMenu(false);
            }}
            className="p-2 rounded hover:bg-gray-200 flex items-center gap-1"
            title="Tamanho da fonte"
          >
            <Type className="w-4 h-4" />
            <ChevronsUpDown className="w-3 h-3" />
          </button>
          {showFontSizeMenu && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-[150px]">
              {fontSizes.map((size) => (
                <button
                  key={size.value}
                  type="button"
                  onClick={() => {
                    editor.chain().focus().setFontSize(size.value).run();
                    setShowFontSizeMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                  style={{ fontSize: size.value }}
                >
                  {size.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tipo de fonte */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowFontFamilyMenu(!showFontFamilyMenu);
              setShowFontSizeMenu(false);
            }}
            className="p-2 rounded hover:bg-gray-200 flex items-center gap-1"
            title="Tipo de fonte"
          >
            <span className="text-sm font-semibold">A</span>
            <ChevronsUpDown className="w-3 h-3" />
          </button>
          {showFontFamilyMenu && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-[180px]">
              {fontFamilies.map((font) => (
                <button
                  key={font.value}
                  type="button"
                  onClick={() => {
                    if (font.value === 'inherit') {
                      editor.chain().focus().unsetFontFamily().run();
                    } else {
                      editor.chain().focus().setFontFamily(font.value).run();
                    }
                    setShowFontFamilyMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                  style={{ fontFamily: font.value }}
                >
                  {font.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="w-px bg-gray-300 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive('bold') ? 'bg-gray-300' : ''
          }`}
          title="Negrito"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive('italic') ? 'bg-gray-300' : ''
          }`}
          title="Itálico"
        >
          <Italic className="w-4 h-4" />
        </button>

        <div className="w-px bg-gray-300 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive({ textAlign: 'left' }) ? 'bg-gray-300' : ''
          }`}
          title="Alinhar à esquerda"
        >
          <AlignLeft className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive({ textAlign: 'center' }) ? 'bg-gray-300' : ''
          }`}
          title="Alinhar ao centro"
        >
          <AlignCenter className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive({ textAlign: 'right' }) ? 'bg-gray-300' : ''
          }`}
          title="Alinhar à direita"
        >
          <AlignRight className="w-4 h-4" />
        </button>

        <div className="w-px bg-gray-300 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive('bulletList') ? 'bg-gray-300' : ''
          }`}
          title="Lista com marcadores"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive('orderedList') ? 'bg-gray-300' : ''
          }`}
          title="Lista numerada"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <div className="w-px bg-gray-300 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive('blockquote') ? 'bg-gray-300' : ''
          }`}
          title="Caixa de destaque"
        >
          <Quote className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={addImage}
          className="p-2 rounded hover:bg-gray-200"
          title="Inserir imagem"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={addVideo}
          className="p-2 rounded hover:bg-gray-200"
          title="Inserir vídeo do YouTube"
        >
          <Video className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={addAudioLink}
          className="p-2 rounded hover:bg-gray-200"
          title="Inserir link de áudio"
        >
          <Music className="w-4 h-4" />
        </button>
      </div>

      <div
        className="overflow-y-auto max-h-[400px]"
        onClick={() => {
          setShowFontSizeMenu(false);
          setShowFontFamilyMenu(false);
        }}
      >
        <EditorContent
          editor={editor}
          className="prose max-w-none p-4 min-h-[200px] focus:outline-none"
        />
      </div>

      <style>{`
        .ProseMirror {
          outline: none;
        }
        .ProseMirror p {
          margin: 0.5em 0;
        }
        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 1.5em;
          margin: 0.5em 0;
        }
        .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 0.375rem;
          margin: 0.5em 0;
        }
        .ProseMirror blockquote {
          border-left: 4px solid #7a1515;
          background: #f7eeee;
          padding: 12px 16px;
          border-radius: 8px;
          font-style: italic;
          margin: 0.75em 0;
        }
        .ProseMirror blockquote p {
          margin: 0;
        }
        .ProseMirror iframe {
          max-width: 100%;
          aspect-ratio: 16/9;
          margin: 0.5em 0;
        }
        .ProseMirror a {
          color: #f97316;
          text-decoration: underline;
        }
        .ProseMirror strong {
          font-weight: bold;
        }
        .ProseMirror em {
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
