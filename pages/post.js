import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { isValidJSON } from "../utils/utils";

import { RiPaintFill } from "react-icons/ri";
import { FaTimes } from "react-icons/fa";
import { BiCode } from "react-icons/bi";

import { useEditor, EditorContent, ReactNodeViewRenderer } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Bold from "@tiptap/extension-bold";
import CharacterCount from "@tiptap/extension-character-count";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import { lowlight } from "lowlight/lib/core";

import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import CodeBlockComponent from "../components/CodeBlockComponent";

export default function Post() {
  // Form state
  const [post, setPost] = useState({ description: "" });
  const [charCount, setCharCount] = useState(0);
  const [user, loading] = useAuthState(auth);
  const [activeColor, setActiveColor] = useState("#000000");
  const route = useRouter();
  const limit = 300;
  const routeData = route.query;
  const buttonStyle = {
    base: "flex justify-center items-center bg-gray-500 font-medium rounded-md text-sm hover:border-2 border-box",
    cube: "w-9 h-9",
    active: "bg-sky-600 dark:bg-sky-400 text-gray-800",
    inactive: "text-white",
  };

  lowlight.registerLanguage("html", html);
  lowlight.registerLanguage("css", css);
  lowlight.registerLanguage("js", js);
  lowlight.registerLanguage("ts", ts);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      CharacterCount.configure({
        limit,
      }),
      Color,
      TextStyle,
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockComponent);
        },
      }).configure({ lowlight }),
      ,
    ],
    editorProps: {
      attributes: {
        class: "min-h-full",
      },
    },
    onUpdate: ({ editor }) => {
      if (routeData.hasOwnProperty("id")) {
        setPost({
          id: routeData.id,
          description: JSON.stringify(editor.getJSON()),
        });
      } else {
        setPost({
          description: JSON.stringify(editor.getJSON()),
        });
      }
      setCharCount(editor.storage.characterCount.characters());
    },

    content: ``,
  });

  // Submit post
  const submitPost = async (e) => {
    e.preventDefault();

    const toastOptions = {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 2000,
    };

    if (!post.description) {
      toast.error("Nem adtál meg szöveget", toastOptions);
      return;
    }

    if (charCount > 300) {
      toast.error("A bejegyzés szövege túl hosszú", toastOptions);
      return;
    }

    if (post?.hasOwnProperty("id")) {
      // Update post
      const docRef = doc(db, "posts", post.id);
      const updatedPost = { ...post, updatedAt: serverTimestamp() };
      await updateDoc(docRef, updatedPost);
      toast.success("Sikeres mentés", toastOptions);
      return route.push("/dashboard");
    } else {
      // Create new post
      const collectionRef = collection(db, "posts");
      await addDoc(collectionRef, {
        ...post,
        timestamp: serverTimestamp(),
        updatedAt: serverTimestamp(),
        user: user.uid,
        avatar: user.photoURL,
        username: user.displayName,
        liked: false,
      });
      setPost({ description: "" });
      toast.success("Sikeres létrehozás", toastOptions);
      return route.push("/");
    }
  };

  const cancelPost = () => {
    if (post?.hasOwnProperty("id")) {
      // Back
      route.push("/dashboard");
    } else {
      // Crlear te textarea
      setPost({ description: "" });
    }
  };

  // Check our user
  const init = async () => {
    if (loading) return;
    if (!user) route.push("/auth/login");

    if (routeData.id) {
      setPost({
        id: routeData.id,
        description: routeData.description,
      });
    }

    // Fill editor
    if (editor) {
      if (post.hasOwnProperty("id") && editor) {
        editor.commands.setContent(
          isValidJSON(post.description)
            ? JSON.parse(post.description)
            : post.description
        );
      }
      setCharCount(editor.storage.characterCount.characters());
    }
  };

  useEffect(() => {
    init();
  }, [user, loading, routeData, editor]);

  return (
    <div className="my-10 p-6 shadow-lg rounded-lg max-w-md mx-auto dark:bg-slate-700 dark:text-sky-100">
      <h1 className="text-2xl font-bold mb-3">
        {post?.hasOwnProperty("id")
          ? "Bejegyzés szerkesztése"
          : "Bejegyzés létrehozása"}
      </h1>

      {/* EDITOR */}
      {editor && (
        <div>
          <div className="flex justify-start items-center mb-3 gap-3">
            {/* Toggle bold */}
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              title="Félkövér"
              className={`text-bold ${buttonStyle.base} ${buttonStyle.cube} ${
                editor.isActive("bold")
                  ? buttonStyle.active
                  : buttonStyle.inactive
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
                className={`rounded-r-none ${buttonStyle.base} ${buttonStyle.cube}`}
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

            <button
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={`text-xl ${buttonStyle.base} ${buttonStyle.cube} ${
                editor.isActive("codeBlock")
                  ? buttonStyle.active
                  : buttonStyle.inactive
              }`}
            >
              <BiCode />
            </button>
          </div>
          <EditorContent
            editor={editor}
            className="bg-gray-800 h-48 w-full text-white rounded-lg p-2 text-sm overflow-x-hidden"
          />
        </div>
      )}
      {/* EDITOR END */}
      <div
        className={`font-medium text-sm mt-2 text-right ${
          charCount > 300
            ? "text-red-600 dark:text-red-400"
            : "text-sky-600 dark:text-sky-100"
        }`}
      >
        {charCount}/300
      </div>

      <div>
        <button
          onClick={submitPost}
          disabled={charCount <= 0}
          className="w-1/2 bg-sky-600 dark:bg-sky-400 text-white dark:text-gray-800 font-medium p-2 my-2 rounded-lg text-sm disabled:text-gray-500 disabled:bg-sky-900"
        >
          {post.hasOwnProperty("id") ? "Mentés" : "Létrehozás"}
        </button>
        <button
          type="button"
          className="w-1/2 font-medium p-2 my-2 rounded-lg text-sm disabled:text-gray-600"
          disabled={charCount <= 0}
          onClick={() => cancelPost()}
        >
          Mégsem
        </button>
      </div>
    </div>
  );
}
