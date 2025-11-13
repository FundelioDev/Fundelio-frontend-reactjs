import { useRef, useEffect, memo } from 'react';
import toast from 'react-hot-toast';
import { buildVideoEmbed } from '../../../../utils/embed';
import { storageApi } from '@/api/storageApi';

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
    // Update content when blank data changes from Redux
    if (titleRef.current && blank.titleHtml !== undefined) {
      const currentTitle = titleRef.current.innerHTML;
      if (currentTitle !== blank.titleHtml) {
        titleRef.current.innerHTML = blank.titleHtml || 'Untitled';
      }
    }

    if (editorRef.current && blank.contentHtml !== undefined) {
      const currentContent = editorRef.current.innerHTML;
      // Only update if content is actually different to avoid cursor issues
      if (currentContent !== blank.contentHtml) {
        editorRef.current.innerHTML = blank.contentHtml || '';
      }
    }
  }, [blank.titleHtml, blank.contentHtml]);

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
      const html = editorRef.current.innerHTML;
      console.log('BlankSection handleContentInput - Blank ID:', blank.id, 'HTML length:', html.length);
      onContentChange(blank.id, html);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    if (!e.dataTransfer.files.length) return;

    const file = e.dataTransfer.files[0];
    if (!file.type.startsWith('image/')) return;

    // Create loading overlay
    const overlay = document.createElement('div');
    overlay.className = 'absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl';
    overlay.innerHTML = `
      <div class="flex flex-col items-center gap-3">
        <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <span class="text-white text-sm font-medium">Đang tải ảnh lên...</span>
      </div>
    `;

    // Add overlay to editor's parent (the section)
    const section = editorRef.current?.closest('section');
    if (section) {
      section.style.position = 'relative';
      section.appendChild(overlay);
    }

    try {
      // Upload to server
      const response = await storageApi.uploadSingleFile(file, 'campaigns/story-images');

      if (response?.data?.data?.fileUrl) {
        const imageUrl = response.data.data.fileUrl;

        // Create and insert actual image
        const img = document.createElement('img');
        img.src = imageUrl;
        img.className = 'max-w-full h-auto block mx-auto my-4 rounded-xl';
        img.alt = file.name;

        placeBlock(editorRef.current, img);
        handleContentInput();
      } else {
        toast.error('Không lấy được URL ảnh sau khi tải lên');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.errors?.[0]?.message || 'Lỗi tải ảnh lên');
    } finally {
      // Remove overlay
      if (overlay && overlay.parentNode) {
        overlay.remove();
      }
    }
  };

  const handlePaste = (e) => {
    const text = e.clipboardData.getData('text/plain');
    if (text && /^https?:\/\//i.test(text)) {
      const iframe = buildVideoEmbed(text);
      if (iframe) {
        e.preventDefault();
        placeBlock(editorRef.current, iframe);
        // Trigger content change callback immediately
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
        className="w-full px-4 py-3 text-xl font-semibold border border-border rounded-sm mb-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-darker dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600"
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
        className="min-h-[40vh] p-4 border border-border rounded-sm 
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

// ✨ Custom comparison function - re-render when content changes
export default memo(BlankSection, (prevProps, nextProps) => {
  // Return true nếu props GIỐNG NHAU (không cần re-render)
  // Return false nếu props KHÁC NHAU (cần re-render)

  // Re-render if blank ID changes or content changes
  if (prevProps.blank.id !== nextProps.blank.id) {
    return false; // Different blank, need re-render
  }

  if (prevProps.blank.contentHtml !== nextProps.blank.contentHtml) {
    return false; // Content changed, need re-render
  }

  if (prevProps.blank.titleHtml !== nextProps.blank.titleHtml) {
    return false; // Title changed, need re-render
  }

  return true; // Props are the same, skip re-render
});
