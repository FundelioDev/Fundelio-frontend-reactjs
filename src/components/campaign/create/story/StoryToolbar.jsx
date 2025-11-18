import { useRef, useState } from 'react';
import { Heading2, Image, Video, RefreshCcw, CloudCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { buildVideoEmbed } from '../../../../utils/embed';
import { storageApi } from '../../../../api/storageApi';
import VideoModal from './VideoModal';
import ColorPicker from './ColorPicker';

/**
 * StoryToolbar component - Editor toolbar with formatting options
 * @param {Object} props
 * @param {Object} props.activeEditorRef - Reference to currently active editor
 * @param {Function} props.onSave - Callback when save button is clicked
 * @param {'idle' | 'saving' | 'saved'} props.saveStatus - Current save status
 */
export default function StoryToolbar({ activeEditorRef, onSave, saveStatus = 'idle' }) {
  const imgPickerRef = useRef(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const execCommand = (command, value = null) => {
    if (!activeEditorRef.current) return;
    document.execCommand(command, false, value);
    activeEditorRef.current.focus();
  };

  const handleBold = () => {
    execCommand('bold');
  };

  const handleItalic = () => {
    execCommand('italic');
  };

  const handleUnderline = () => {
    execCommand('underline');
  };

  const handleH2 = () => {
    if (!activeEditorRef.current) return;
    const h2 = document.createElement('h2');
    h2.textContent = 'Tiêu đề cấp 2';
    h2.className = 'text-2xl font-bold mt-4 mb-2 dark:text-white';
    placeBlock(activeEditorRef.current, h2);
  };

  const handleVideoSubmit = (url) => {
    if (!activeEditorRef.current) return;

    const iframe = buildVideoEmbed(url);
    if (iframe) {
      placeBlock(activeEditorRef.current, iframe);

      // Trigger input event to save content
      const inputEvent = new Event('input', { bubbles: true });
      activeEditorRef.current.dispatchEvent(inputEvent);

      toast.success('Đã thêm video thành công!');
    } else if (/^https?:\/\//i.test(url)) {
      execCommand('createLink', url);
      toast.success('Đã thêm link thành công!');
    } else {
      toast.error('URL không hợp lệ. Vui lòng kiểm tra lại.');
    }
  };

  const handleImagePicker = () => {
    imgPickerRef.current?.click();
  };

  const handleImageChange = async (e) => {
    if (!activeEditorRef.current) return;
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh hợp lệ');
      return;
    }

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
    const section = activeEditorRef.current?.closest('section');
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

        placeBlock(activeEditorRef.current, img);

        // Trigger input event to save content
        const inputEvent = new Event('input', { bubbles: true });
        activeEditorRef.current.dispatchEvent(inputEvent);

        toast.success('Đã tải ảnh lên thành công!');
      } else {
        toast.error('Không lấy được URL ảnh sau khi tải lên', { id: 'upload-story-image' });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(
        error.response?.data?.errors?.[0]?.message || 'Lỗi tải ảnh lên',
        { id: 'upload-story-image' }
      );
    } finally {
      // Remove overlay
      if (overlay && overlay.parentNode) {
        overlay.remove();
      }
    }

    // Reset input
    e.target.value = '';
  };

  const handleColorChange = (color) => {
    execCommand('foreColor', color);
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

    // Trigger input event to save changes
    editor.dispatchEvent(new Event('input', { bubbles: true }));
  };

  return (
    <>
      <div className="sticky top-20 z-10 flex gap-2 flex-wrap bg-white dark:bg-darker-2 inset-shadow-2xs shadow-md rounded-sm py-3 px-6 mb-4">
        {/* Text Formatting */}
        <button
          onClick={handleBold}
          className="px-2.5 py-2 border border-border bg-white dark:bg-darker rounded-sm text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors dark:text-white"
          title="Bold (Ctrl+B)"
        >
          B
        </button>

        <button
          onClick={handleItalic}
          className="px-2.5 py-2 border border-border bg-white dark:bg-darker rounded-sm text-sm italic hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors dark:text-white"
          title="Italic (Ctrl+I)"
        >
          I
        </button>

        <button
          onClick={handleUnderline}
          className="px-2.5 py-2 border border-border bg-white dark:bg-darker rounded-sm text-sm underline hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors dark:text-white"
          title="Underline (Ctrl+U)"
        >
          U
        </button>

        {/* Divider */}
        <div className="w-px bg-gray-300 dark:bg-gray-700 mx-1" />

        {/* Heading */}
        <button
          onClick={handleH2}
          className="flex items-center gap-1.5 px-3 py-2 border border-border bg-white dark:bg-darker rounded-sm text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors dark:text-white"
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
          <span>Tiêu đề</span>
        </button>

        {/* Video */}
        <button
          onClick={() => setIsVideoModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 border border-border bg-white dark:bg-darker rounded-sm text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors dark:text-white"
          title="Add Video"
        >
          <Video className="w-4 h-4" />
          <span>Video</span>
        </button>

        {/* Image */}
        <button
          onClick={handleImagePicker}
          className="flex items-center gap-1.5 px-3 py-2 border border-border bg-white dark:bg-darker rounded-sm text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors dark:text-white"
          title="Upload Image/GIF"
        >
          <Image className="w-4 h-4" />
          <span>Ảnh/GIF</span>
        </button>

        {/* Divider */}
        <div className="w-px bg-gray-300 dark:bg-gray-700 mx-1" />

        {/* Color Picker */}
        <ColorPicker onColorSelect={handleColorChange} />

        {/* Save Status */}
        <button
          onClick={onSave}
          disabled={saveStatus === 'saving'}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-sm text-sm font-medium transition-colors ml-auto ${saveStatus === 'saving'
            ? 'bg-muted text-muted-foreground cursor-not-allowed'
            : 'bg-white dark:bg-darker border border-border text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          title={
            saveStatus === 'saving'
              ? 'Đang lưu...'
              : 'Đã lưu tự động'
          }
        >
          {saveStatus === 'saving' ? (
            <>
              <RefreshCcw className="w-4 h-4 animate-spin" />
              <span>Đang lưu...</span>
            </>
          ) : (
            <CloudCheck className="w-4 h-4" />
          )}
        </button>

        <input
          ref={imgPickerRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </div>

      {/* Video Modal */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        onSubmit={handleVideoSubmit}
      />
    </>
  );
}
