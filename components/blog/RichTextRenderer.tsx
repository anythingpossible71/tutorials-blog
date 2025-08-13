"use client";

import { SerializedEditorState } from "lexical";

interface RichTextRendererProps {
  content: string;
}

export function RichTextRenderer({ content }: RichTextRendererProps) {
  // Try to parse the content as rich text editor state
  let editorState: SerializedEditorState | null = null;
  let isRichText = false;

  try {
    editorState = JSON.parse(content);
    isRichText = editorState && editorState.root && editorState.root.children;
  } catch {
    // If parsing fails, treat as plain text
    isRichText = false;
  }

  if (!isRichText) {
    // Fallback to simple text rendering
    return (
      <div className="prose prose-lg max-w-none">
        {content.split('\n').map((line, index) => {
          if (line.trim() === '') {
            return <br key={index} />;
          }
          return <p key={index} className="text-gray-700 leading-relaxed mb-4">{line}</p>;
        })}
      </div>
    );
  }

  // Render rich text content
  const renderNode = (node: any, index: number) => {
    if (!node) return null;

    switch (node.type) {
      case 'paragraph':
        return (
          <p key={index} className="text-gray-700 leading-relaxed mb-4">
            {node.children?.map((child: any, childIndex: number) => renderTextNode(child, childIndex))}
          </p>
        );
      
      case 'heading':
        const HeadingTag = `h${node.tag}` as keyof JSX.IntrinsicElements;
        const headingClasses = {
          h1: "text-3xl font-bold text-gray-900 mt-8 mb-4",
          h2: "text-2xl font-semibold text-gray-900 mt-6 mb-3",
          h3: "text-xl font-semibold text-gray-900 mt-4 mb-2",
        }[node.tag] || "text-xl font-semibold text-gray-900 mt-4 mb-2";
        
        return (
          <HeadingTag key={index} className={headingClasses}>
            {node.children?.map((child: any, childIndex: number) => renderTextNode(child, childIndex))}
          </HeadingTag>
        );
      
      case 'quote':
        return (
          <blockquote key={index} className="border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-4">
            {node.children?.map((child: any, childIndex: number) => renderTextNode(child, childIndex))}
          </blockquote>
        );
      
      case 'list':
        const ListTag = node.listType === 'number' ? 'ol' : 'ul';
        const listClasses = node.listType === 'number' 
          ? "list-decimal list-inside mb-4 space-y-1" 
          : "list-disc list-inside mb-4 space-y-1";
        
        return (
          <ListTag key={index} className={listClasses}>
            {node.children?.map((child: any, childIndex: number) => (
              <li key={childIndex} className="text-gray-700">
                {child.children?.map((grandChild: any, grandChildIndex: number) => 
                  renderTextNode(grandChild, grandChildIndex)
                )}
              </li>
            ))}
          </ListTag>
        );
      
      default:
        return null;
    }
  };

  const renderTextNode = (node: any, index: number) => {
    if (!node || node.type !== 'text') return null;

    let text = node.text || '';
    
    // Apply formatting
    if (node.format & 1) text = <strong key={index}>{text}</strong>; // Bold
    if (node.format & 2) text = <em key={index}>{text}</em>; // Italic
    if (node.format & 4) text = <u key={index}>{text}</u>; // Underline

    return text;
  };

  return (
    <div className="prose prose-lg max-w-none">
      {editorState.root.children.map((node: any, index: number) => renderNode(node, index))}
    </div>
  );
}
