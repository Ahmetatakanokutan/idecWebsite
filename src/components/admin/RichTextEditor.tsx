import { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Bold, Italic, List, ListOrdered, Link as LinkIcon, Heading3, Heading4 } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
}

const toolbarBtnClass = (active: boolean) =>
  `p-1.5 rounded-md transition-colors ${
    active ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600 hover:bg-gray-100'
  }`;

// Admin protokol yazmayi unutursa link kirilmasin: / ile baslayanlar site-ici
// goreli yol, http(s):// ile baslayanlar oldugu gibi, digerlerinin basina https:// eklenir.
const normalizeUrl = (raw: string) => {
  if (!raw) return '';
  if (raw.startsWith('/')) return raw;
  if (/^https?:\/\//i.test(raw)) return raw;
  return `https://${raw}`;
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const [showLinkPopover, setShowLinkPopover] = useState(false);
  const [linkInputValue, setLinkInputValue] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [3, 4] },
        blockquote: false,
        codeBlock: false,
        horizontalRule: false,
        strike: false,
        code: false,
      }),
      Link.configure({
        openOnClick: false,
        autolink: false,
      }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Duzenlenen duyuru degisirse (ornegin baska bir kayit secilirse) editor icerigini senkronize et
  useEffect(() => {
    if (!editor) return;
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value || '', { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  const handleLinkButtonClick = () => {
    const existingHref = (editor.getAttributes('link').href as string) || '';
    setLinkInputValue(existingHref);
    setShowLinkPopover((prev) => !prev);
  };

  const applyLink = () => {
    const url = normalizeUrl(linkInputValue.trim());
    if (!url) {
      setShowLinkPopover(false);
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    setShowLinkPopover(false);
    setLinkInputValue('');
  };

  const removeLink = () => {
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
    setShowLinkPopover(false);
  };

  return (
    <div className="border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500">
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 px-2 py-1.5">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={toolbarBtnClass(editor.isActive('bold'))}
          title="Kalın"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={toolbarBtnClass(editor.isActive('italic'))}
          title="İtalik"
        >
          <Italic className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-gray-200 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={toolbarBtnClass(editor.isActive('heading', { level: 3 }))}
          title="Alt Başlık (H3)"
        >
          <Heading3 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          className={toolbarBtnClass(editor.isActive('heading', { level: 4 }))}
          title="Alt Başlık (H4)"
        >
          <Heading4 className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-gray-200 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={toolbarBtnClass(editor.isActive('bulletList'))}
          title="Madde İşaretli Liste"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={toolbarBtnClass(editor.isActive('orderedList'))}
          title="Numaralı Liste"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-gray-200 mx-1" />

        <div className="relative">
          <button
            type="button"
            onClick={handleLinkButtonClick}
            className={toolbarBtnClass(editor.isActive('link') || showLinkPopover)}
            title="Bağlantı Ekle"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
          {showLinkPopover && (
            <div className="absolute z-20 top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3 w-64">
              <label className="block text-xs font-medium text-gray-600 mb-1">Bağlantı Adresi</label>
              <input
                type="text"
                autoFocus
                value={linkInputValue}
                onChange={(e) => setLinkInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    applyLink();
                  } else if (e.key === 'Escape') {
                    setShowLinkPopover(false);
                  }
                }}
                placeholder="https://... veya /sayfa"
                className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
              <div className="flex items-center justify-end gap-2 mt-2">
                {editor.isActive('link') && (
                  <button type="button" onClick={removeLink} className="text-xs text-red-600 hover:text-red-700 mr-auto">
                    Kaldır
                  </button>
                )}
                <button type="button" onClick={() => setShowLinkPopover(false)} className="text-xs px-2 py-1 text-gray-600 hover:text-gray-800">
                  İptal
                </button>
                <button type="button" onClick={applyLink} className="text-xs px-2 py-1 bg-emerald-600 text-white rounded-md hover:bg-emerald-700">
                  Ekle
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <EditorContent
        editor={editor}
        className="min-h-[160px] max-h-80 overflow-y-auto px-3 py-2 text-sm [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[140px] [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-1 [&_h4]:text-base [&_h4]:font-bold [&_h4]:mb-1 [&_a]:text-emerald-600 [&_a]:underline [&_p]:mb-2"
      />
    </div>
  );
};

export default RichTextEditor;
