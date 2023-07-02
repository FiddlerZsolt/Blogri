import dynamic from "next/dynamic";
import { useRef, useState } from "react";

import "react-quill/dist/quill.snow.css";
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");

    return ({ forwardedRef, ...props }) => <RQ ref={forwardedRef} {...props} />;
  },
  {
    ssr: false
  }
);

export default function QuillEditor() {
  const quillRef = useRef(false)
  const [value, setValue] = useState("");

  // TODO:
  const [charCount, setCharCount] = useState(0);

  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      ["blockquote"],

      [{ header: [2, 3, 4, 5, 6, false] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ direction: "rtl" }],

      [{ color: [] }, { background: [] }],
      [{ align: [] }],

      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  return (
    <div className="bg-gray-800 w-full rounded-lg p-2">
      <div>
        <ReactQuill
          forwardedRef={quillRef}
          value={value}
          onChange={setValue}
          modules={modules}
          formats={formats}
        />
      </div>
      <div>{value}</div>
      <div>{charCount}/300</div>
    </div>
  );
}
