"use client";

import { useState } from "react";
import { SerializedEditorState } from "lexical";
import { Editor } from "@/components/blocks/editor-x/editor";
import { FloatingTextFormatToolbarPlugin } from "@/components/editor/plugins/floating-text-format-plugin";

const initialValue = {
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text: "",
            type: "text",
            version: 1,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1,
      },
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
} as unknown as SerializedEditorState;

interface SimpleRichTextEditorProps {
  value: SerializedEditorState;
  onChange: (value: SerializedEditorState) => void;
  placeholder?: string;
}

export function SimpleRichTextEditor({ value, onChange, placeholder }: SimpleRichTextEditorProps) {
  const [editorState, setEditorState] = useState<SerializedEditorState>(value || initialValue);

  const handleChange = (newState: SerializedEditorState) => {
    setEditorState(newState);
    onChange(newState);
  };

  return (
    <div className="relative">
      <Editor
        editorSerializedState={editorState}
        onSerializedChange={handleChange}
        placeholder={placeholder || "Write your post content..."}
        plugins={[
          FloatingTextFormatToolbarPlugin,
        ]}
        className="min-h-[1.5rem] border-none focus:outline-none"
      />
    </div>
  );
}
