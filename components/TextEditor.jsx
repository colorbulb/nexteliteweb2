// Simple rich text editor component
import React, { useRef, useEffect } from 'react';

export const TextEditor = ({ value, onChange, placeholder = "Enter content..." }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = (e) => {
    if (onChange) {
      onChange(e.target.innerHTML);
    }
  };

  const handleKeyDown = (e) => {
    // Allow Ctrl+B for bold, Ctrl+I for italic, etc.
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'b') {
        e.preventDefault();
        document.execCommand('bold', false, null);
      } else if (e.key === 'i') {
        e.preventDefault();
        document.execCommand('italic', false, null);
      } else if (e.key === 'u') {
        e.preventDefault();
        document.execCommand('underline', false, null);
      }
    }
  };

  return (
    <div className="border border-slate-300 rounded">
      <div className="border-b border-slate-200 p-2 bg-slate-50 flex gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => document.execCommand('bold', false, null)}
          className="px-3 py-1 text-sm border border-slate-300 rounded hover:bg-slate-200 font-bold"
          title="Bold (Ctrl+B)"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => document.execCommand('italic', false, null)}
          className="px-3 py-1 text-sm border border-slate-300 rounded hover:bg-slate-200 italic"
          title="Italic (Ctrl+I)"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => document.execCommand('underline', false, null)}
          className="px-3 py-1 text-sm border border-slate-300 rounded hover:bg-slate-200 underline"
          title="Underline (Ctrl+U)"
        >
          U
        </button>
        <div className="border-l border-slate-300 mx-1" />
        <button
          type="button"
          onClick={() => document.execCommand('formatBlock', false, '<h1>')}
          className="px-3 py-1 text-sm border border-slate-300 rounded hover:bg-slate-200"
          title="Heading 1"
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => document.execCommand('formatBlock', false, '<h2>')}
          className="px-3 py-1 text-sm border border-slate-300 rounded hover:bg-slate-200"
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => document.execCommand('formatBlock', false, '<h3>')}
          className="px-3 py-1 text-sm border border-slate-300 rounded hover:bg-slate-200"
          title="Heading 3"
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => document.execCommand('formatBlock', false, '<p>')}
          className="px-3 py-1 text-sm border border-slate-300 rounded hover:bg-slate-200"
          title="Paragraph"
        >
          P
        </button>
        <div className="border-l border-slate-300 mx-1" />
        <button
          type="button"
          onClick={() => document.execCommand('insertUnorderedList', false, null)}
          className="px-3 py-1 text-sm border border-slate-300 rounded hover:bg-slate-200"
          title="Bullet List"
        >
          •
        </button>
        <button
          type="button"
          onClick={() => document.execCommand('insertOrderedList', false, null)}
          className="px-3 py-1 text-sm border border-slate-300 rounded hover:bg-slate-200"
          title="Numbered List"
        >
          1.
        </button>
        <button
          type="button"
          onClick={() => document.execCommand('createLink', false, prompt('Enter URL:'))}
          className="px-3 py-1 text-sm border border-slate-300 rounded hover:bg-slate-200"
          title="Insert Link"
        >
          🔗
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        className="min-h-[200px] p-4 focus:outline-none"
        style={{ whiteSpace: 'pre-wrap' }}
        data-placeholder={placeholder}
      />
      <style>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #94a3b8;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

