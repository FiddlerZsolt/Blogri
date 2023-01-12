import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import CharacterCount from "@tiptap/extension-character-count";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import Placeholder from "@tiptap/extension-placeholder";
import { useState } from "react";
import { RiPaintFill } from "react-icons/ri";
import { FaTimes } from "react-icons/fa";

export default function Editor({ defaultContent, onUpdate }) {
  const limit = 300;
  const [activeColor, setActiveColor] = useState("#000000");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      CharacterCount.configure({
        limit,
      }),
      Color,
      TextStyle,
      Placeholder.configure({
        emptyEditorClass: "editor-is-empty",
        placeholder: "Write something …",
        // Use different placeholders depending on the node type:
        // placeholder: ({ node }) => {
        //   if (node.type.name === 'heading') {
        //     return 'What’s the title?'
        //   }

        //   return 'Can you add some further context?'
        // },
      }),
    ],
    // content: "<p>Hello World!</p>",
    content: defaultContent,
  });

  const editor2 = useEditor({
    editable: false,
    extensions: [StarterKit, Color, TextStyle],
    content: "",
  });

  if (!editor || !editor2) {
    return null;
  }

  const saveContent = () => {
    editor2.commands.setContent(editor.getJSON());
  };

  const buttonStyle = {
    base: "flex justify-center items-center bg-gray-500 font-medium rounded-md text-sm",
    cube: "w-9 h-9",
    active: "bg-sky-600 dark:bg-sky-400 text-gray-800",
    inactive: "text-white",
  };

  return (
    <div>
      <div className="flex justify-start items-center mb-3 gap-3">
        {/* Toggle bold */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Félkövér"
          className={`text-bold ${buttonStyle.base} ${buttonStyle.cube} ${
            editor.isActive("bold") ? buttonStyle.active : buttonStyle.inactive
          }`}
        >
          B
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Félkövér"
          className={`${buttonStyle.base} ${buttonStyle.cube} ${
            editor.isActive("italic")
              ? buttonStyle.active
              : buttonStyle.inactive
          }`}
        >
          <i>i</i>
        </button>

        {/* Set, choose and remove color */}
        <div className="flex">
          <button
            onClick={() => {
              editor.chain().focus().setColor(activeColor).run();
            }}
            className={`rounded-r-none ${buttonStyle.base} ${buttonStyle.cube} ${
              editor.isActive("textStyle", { color: activeColor })
                ? buttonStyle.active
                : buttonStyle.inactive
            }`}
          >
            <RiPaintFill />
          </button>

          <input
            className={`rounded-none w-10 h-9 px-1 ${buttonStyle.base}`}
            type="color"
            onInput={(event) => {
              editor.chain().focus().setColor(event.target.value).run();
              setActiveColor(event.target.value);
            }}
            value={editor.getAttributes("textStyle").color}
          />

          <button
            className={`rounded-l-none ${buttonStyle.base}  ${buttonStyle.cube}`}
            onClick={() => editor.chain().focus().unsetColor().run()}
          >
            <FaTimes />
          </button>
        </div>
      </div>
      <EditorContent
        editor={editor}
        className="bg-gray-800 h-48 w-full text-white rounded-lg p-2 text-sm"
      />

      <p
        className={`font-medium text-sm ${
          editor.storage.characterCount.characters() > 300
            ? "text-red-600 dark:text-red-400"
            : "text-sky-600 dark:text-sky-100"
        }`}
      >
        {editor.storage.characterCount.characters()}/300
      </p>

      <button onClick={saveContent} className="p-3 bg-cyan-500 rounded-md my-4">
        Save
      </button>

      <EditorContent
        editor={editor2}
        className="bg-gray-800 h-48 w-full text-white rounded-lg p-2 text-sm"
      />
    </div>
  );
}
