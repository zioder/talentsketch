"use client";

import React, { useMemo, useState } from "react";
import QuillEditor from "react-quill";
import "react-quill/dist/quill.snow.css";

const RichTextEditor = ({
  onRichTextEditorChange,
  index,
  defaultValue,
}: {
  onRichTextEditorChange: (value: any) => void;
  index: number;
  defaultValue: string;
}) => {
  const [value, setValue] = useState(defaultValue);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [3, 4, 5, false] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ color: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link"],
          ["clean"],
        ],
      },
      clipboard: {
        matchVisual: true,
      },
    }),
    []
  );

  return (
    <QuillEditor
      theme="snow"
      value={value}
      modules={modules}
      onChange={(e: any) => {
        setValue(e);
        onRichTextEditorChange({ target: { name: "workSummary", value: e } });
      }}
      className="mt-2"
      style={{ borderColor: "#E5E7EB" }}
    />
  );
};

export default RichTextEditor;
