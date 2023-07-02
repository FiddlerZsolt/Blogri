import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import { EditorContent, ReactNodeViewRenderer, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import { secondsToDateTimeString, isValidJSON } from "../utils/utils";
import { BsPersonCircle } from "react-icons/bs";
import { lowlight } from "lowlight/lib/core";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import CodeBlockComponent from "./CodeBlockComponent";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";

export default function Message({
  children,
  avatar,
  username,
  description,
  timestamp,
}) {
  const dateTimeString = timestamp
    ? secondsToDateTimeString(timestamp.seconds)
    : "";


  lowlight.registerLanguage("html", html);
  lowlight.registerLanguage("css", css);
  lowlight.registerLanguage("js", js);
  lowlight.registerLanguage("ts", ts);
  
  const body = useEditor({
    editable: false,
    extensions: [
      StarterKit,
      Color,
      TextStyle,
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockComponent);
        },
      }).configure({ lowlight }),
    ],
  });

  useEffect(() => {
    if (body) {
      if (isValidJSON(description)) {
        body?.commands?.setContent(JSON.parse(description));
      } else {
        body?.commands?.setContent(description);
      }
    }
  }, [body]);

  return (
    <div className="shadow-md shadow-slate-300 dark:shadow-none bg-white px-8 py-4 rounded-lg dark:bg-slate-700 dark:text-sky-100 mt-3">
      <div className="flex justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full">
            <BsPersonCircle className="w-10 h-10 rounded-full" />
          </div>
          {/* <img src={ avatar } className="w-10 h-10 rounded-full" /> */}
          <h2>{username}</h2>
        </div>
        <div className="flex justify-end">
          <span className="text-sm text-right">{dateTimeString}</span>
        </div>
      </div>
      <div className="py-4">
        <EditorContent
          editor={body}
          className="w-full rounded-lg p-2 text-sm bg-slate-800"
        />
      </div>
      {children}
    </div>
  );
}
