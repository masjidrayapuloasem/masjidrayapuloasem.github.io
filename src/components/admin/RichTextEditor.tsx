import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import DOMPurify from "dompurify";
import { useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { isValidUrl } from "@/lib/errorUtils";
import { useToast } from "@/hooks/use-toast";
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  Heading1,
  Heading2,
  Heading3,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Upload,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const MenuButton = ({
  onClick,
  isActive,
  disabled,
  children,
  title,
}: {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title: string;
}) => (
  <Button
    type="button"
    variant="ghost"
    size="sm"
    onClick={onClick}
    disabled={disabled}
    className={cn(
      "h-8 w-8 p-0",
      isActive && "bg-muted text-primary"
    )}
    title={title}
  >
    {children}
  </Button>
);

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Tulis konten di sini...",
  className,
}: RichTextEditorProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose dark:prose-invert max-w-none min-h-[200px] p-4 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      // Sanitize HTML output to prevent XSS attacks
      const sanitizedHTML = DOMPurify.sanitize(editor.getHTML(), {
        ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'hr'],
        ALLOWED_ATTR: ['href', 'src', 'alt', 'class', 'target', 'rel', 'style'],
      });
      onChange(sanitizedHTML);
    },
  });

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt("Masukkan URL (harus dimulai dengan http:// atau https://):");
    if (url) {
      if (!isValidUrl(url)) {
        window.alert("URL tidak valid. Gunakan format http:// atau https://");
        return;
      }
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt("Masukkan URL gambar (harus dimulai dengan http:// atau https://):");
    if (url) {
      if (!isValidUrl(url)) {
        window.alert("URL gambar tidak valid. Gunakan format http:// atau https://");
        return;
      }
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "File harus berupa gambar", variant: "destructive" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Ukuran gambar maksimal 5MB", variant: "destructive" });
      return;
    }

    const ext = file.name.split(".").pop();
    const fileName = `editor/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { data, error } = await supabase.storage
      .from("cms-images")
      .upload(fileName, file);

    if (error) {
      toast({ title: "Gagal upload gambar", description: error.message, variant: "destructive" });
      return;
    }

    const { data: urlData } = supabase.storage
      .from("cms-images")
      .getPublicUrl(data.path);

    editor.chain().focus().setImage({ src: urlData.publicUrl }).run();
    toast({ title: "Gambar berhasil diupload" });

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className={cn("rounded-md border bg-background", className)}>
      <div className="flex flex-wrap items-center gap-1 border-b p-2">
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </MenuButton>

        <div className="mx-1 h-6 w-px bg-border" />

        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </MenuButton>

        <div className="mx-1 h-6 w-px bg-border" />

        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        >
          <Minus className="h-4 w-4" />
        </MenuButton>

        <div className="mx-1 h-6 w-px bg-border" />

        <MenuButton
          onClick={addLink}
          isActive={editor.isActive("link")}
          title="Add Link"
        >
          <LinkIcon className="h-4 w-4" />
        </MenuButton>
        <MenuButton onClick={addImage} title="Gambar dari URL">
          <ImageIcon className="h-4 w-4" />
        </MenuButton>
        <MenuButton onClick={() => fileInputRef.current?.click()} title="Upload Gambar">
          <Upload className="h-4 w-4" />
        </MenuButton>

        <div className="mx-1 h-6 w-px bg-border" />

        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          isActive={editor.isActive({ textAlign: "left" })}
          title="Rata Kiri"
        >
          <AlignLeft className="h-4 w-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          isActive={editor.isActive({ textAlign: "center" })}
          title="Rata Tengah"
        >
          <AlignCenter className="h-4 w-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          isActive={editor.isActive({ textAlign: "right" })}
          title="Rata Kanan"
        >
          <AlignRight className="h-4 w-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          isActive={editor.isActive({ textAlign: "justify" })}
          title="Rata Kanan Kiri"
        >
          <AlignJustify className="h-4 w-4" />
        </MenuButton>

        <div className="mx-1 h-6 w-px bg-border" />

        <MenuButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </MenuButton>
      </div>

      <EditorContent editor={editor} />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />
    </div>
  );
}
