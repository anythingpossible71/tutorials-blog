'use client';

import { useState } from 'react';
import { SerializedEditorState } from 'lexical';
import { RichTextEditor } from '@/components/blog/RichTextEditor';

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
            text: "Test the rich text editor with RTL/LTR buttons. Type Hebrew text: שגדכ גדשכ שגדכ ש.",
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

export default function TestEditorFixPage() {
  const [editorState, setEditorState] = useState<SerializedEditorState>(initialValue);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Rich Text Editor Fix Test</h1>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl mb-4">Testing RTL/LTR and Indentation Buttons</h2>
          
          <div className="border border-gray-200 rounded-md min-h-[300px]">
            <RichTextEditor
              value={editorState}
              onChange={setEditorState}
              placeholder="Test the RTL/LTR buttons with Hebrew text..."
            />
          </div>
          
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <h3 className="font-semibold mb-2">Instructions:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Type Hebrew text: שגדכ גדשכ שגדכ ש.</li>
              <li>Click RTL button - text should flow right-to-left</li>
              <li>Click LTR button - text should flow left-to-right</li>
              <li>Test indentation buttons (left/right arrows)</li>
              <li>Check console (F12) for debug logs</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

