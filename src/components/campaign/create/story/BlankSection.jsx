import { useRef, useEffect, memo } from 'react';
import toast from 'react-hot-toast';
import DOMPurify from 'dompurify';
import { buildVideoEmbed } from '../../../../utils/embed';
import { storageApi } from '@/api/storageApi';

const SANITIZE_CONFIG = {
  ALLOWED_TAGS: [
    'p',
    'br',
    'strong',
    'em',
    'u',
    'ol',
    'ul',
    'li',
    'blockquote',
    'code',
    'pre',
    'a',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'span',
    'div',
  ],
  ALLOWED_ATTR: ['href', 'target', 'rel'],
  FORBID_ATTR: ['style', 'class', 'id'],
  KEEP_CONTENT: true,
};

/**
 * BlankSection component - A single editable section with title and content
 * @param {Object} props
 * @param {Object} props.blank - Blank data object
 * @param {Function} props.onTitleChange - Callback when title changes
 * @param {Function} props.onContentChange - Callback when content changes
 * @param {Function} props.onFocus - Callback when editor is focused
 * @param {boolean} props.isReadOnly - Whether the section is read-only
 */
function BlankSection({ blank, onTitleChange, onContentChange, onFocus, isReadOnly = false }) {
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
        img.className = 'max-w-full h-auto block mx-auto my-4';
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

  const insertHtml = (html) => {
    const selection = window.getSelection();
    if (!selection?.rangeCount) return;

    const range = selection.getRangeAt(0);
    range.deleteContents();

    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = html;

    const fragment = document.createDocumentFragment();
    while (tempContainer.firstChild) {
      fragment.appendChild(tempContainer.firstChild);
    }

    range.insertNode(fragment);
    range.collapse(false);

    selection.removeAllRanges();
    selection.addRange(range);
  };

  const handlePaste = (e) => {
    const html = e.clipboardData.getData('text/html');
    const text = e.clipboardData.getData('text/plain') || '';

    if (text && /^https?:\/\//i.test(text)) {
      const iframe = buildVideoEmbed(text);
      if (iframe) {
        e.preventDefault();
        placeBlock(editorRef.current, iframe);
        handleContentInput();
        return;
      }
    }

    if (html) {
      e.preventDefault();
      const cleanHtml = DOMPurify.sanitize(html, SANITIZE_CONFIG).trim();
      insertHtml(cleanHtml || text);
      handleContentInput();
      return;
    }

    if (text) {
      e.preventDefault();
      insertHtml(text.replace(/\n/g, '<br />'));
      handleContentInput();
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
        contentEditable={!isReadOnly}
        suppressContentEditableWarning
        className={`w-full px-4 py-3 text-xl font-semibold border border-border rounded-sm mb-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-darker dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 ${isReadOnly ? 'opacity-60 cursor-not-allowed bg-gray-50 dark:bg-gray-800' : ''}`}
        placeholder="Tiêu đề blank..."
        spellCheck={false}
        onInput={isReadOnly ? undefined : handleTitleInput}
        onFocus={isReadOnly ? undefined : () => handleFocus('title')}
      />

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable={!isReadOnly}
        suppressContentEditableWarning
        spellCheck={false}
        className={`min-h-[40vh] p-4 border border-border rounded-sm 
        focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent 
        dark:bg-darker dark:text-white prose prose-sm dark:prose-invert max-w-none
        [&_i]:italic [&_em]:italic ${isReadOnly ? 'opacity-60 cursor-not-allowed bg-gray-50 dark:bg-gray-800' : ''}`}
        data-blank-id={blank.id}
        onInput={isReadOnly ? undefined : handleContentInput}
        onFocus={isReadOnly ? undefined : () => handleFocus('editor')}
        onDrop={isReadOnly ? undefined : handleDrop}
        onDragOver={isReadOnly ? undefined : (e) => e.preventDefault()}
        onPaste={isReadOnly ? undefined : handlePaste}
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
