import { useRef, useEffect, memo } from 'react';
import { buildVideoEmbed } from '../../../../utils/embed';

/**
 * BlankSection component - A single editable section with title and content
 * @param {Object} props
 * @param {Object} props.blank - Blank data object
 * @param {Function} props.onTitleChange - Callback when title changes
 * @param {Function} props.onContentChange - Callback when content changes
 * @param {Function} props.onFocus - Callback when editor is focused
 */
function BlankSection({ blank, onTitleChange, onContentChange, onFocus }) {
  const titleRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    // Set initial content only once when component mounts
    if (titleRef.current && !titleRef.current.innerHTML) {
      titleRef.current.innerHTML = blank.titleHtml || 'Untitled';
    }
    if (editorRef.current && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = blank.contentHtml || '';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTitleInput = () => {
    if (titleRef.current) {
      onTitleChange(
        blank.id,
        titleRef.current.innerHTML,
        titleRef.current.innerText.trim()
      );
    }
  };

  const handleContentInput = () => {
    if (editorRef.current) {
      onContentChange(blank.id, editorRef.current.innerHTML);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (!e.dataTransfer.files.length) return;

    const file = e.dataTransfer.files[0];
    if (!file.type.startsWith('image/')) return;

    const url = URL.createObjectURL(file);
    const img = document.createElement('img');
    img.src = url;
    img.className = 'max-w-full h-auto block mx-auto my-4 rounded-xl';

    placeBlock(editorRef.current, img);
    handleContentInput();
  };

  const handlePaste = (e) => {
    const text = e.clipboardData.getData('text/plain');
    if (text && /^https?:\/\//i.test(text)) {
      const iframe = buildVideoEmbed(text);
      if (iframe) {
        e.preventDefault();
        placeBlock(editorRef.current, iframe);
        handleContentInput();
      }
    }
  };

  const placeBlock = (editor, node) => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount) {
      const range = sel.getRangeAt(0);
      if (!editor.contains(range.commonAncestorContainer)) {
        editor.appendChild(node);
        return;
      }
      range.collapse(false);
      range.insertNode(node);
      range.setStartAfter(node);
      range.setEndAfter(node);
      sel.removeAllRanges();
      sel.addRange(range);
    } else {
      editor.appendChild(node);
    }
  };

  const handleFocus = (type) => {
    const ref = type === 'title' ? titleRef : editorRef;
    onFocus(blank.id, ref.current, type);
  };

  return (
    <section
      id={blank.id}
      className="bg-white dark:bg-darker-2 inset-shadow-2xs shadow-md 
      rounded-sm p-6 mb-4 scroll-mt-32 hover:shadow-md transition-shadow"
    >
      {/* Title */}
      <div
        ref={titleRef}
        contentEditable
        suppressContentEditableWarning
        className="w-full px-4 py-3 text-xl font-semibold border border-gray-300 dark:border-gray-700 rounded-sm mb-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-darker dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600"
        placeholder="Tiêu đề blank..."
        spellCheck={false}
        onInput={handleTitleInput}
        onFocus={() => handleFocus('title')}
      />

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        spellCheck={false}
        className="min-h-[40vh] p-4 border border-gray-300 dark:border-gray-700 rounded-sm 
        focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent 
        dark:bg-darker dark:text-white prose prose-sm dark:prose-invert max-w-none
        [&_i]:italic [&_em]:italic"
        data-blank-id={blank.id}
        onInput={handleContentInput}
        onFocus={() => handleFocus('editor')}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onPaste={handlePaste}
      />
    </section>
  );
}

// ✨ Custom comparison function - chỉ re-render khi blank.id thay đổi
export default memo(BlankSection, (prevProps, nextProps) => {
  // Return true nếu props GIỐNG NHAU (không cần re-render)
  // Return false nếu props KHÁC NHAU (cần re-render)
  return prevProps.blank.id === nextProps.blank.id;
});
