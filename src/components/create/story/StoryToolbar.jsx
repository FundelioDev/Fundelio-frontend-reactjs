import { useRef, useState } from 'react';
import { Heading2, Image, Video, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { buildVideoEmbed } from '../../../utils/embed';
import VideoModal from './VideoModal';
import ColorPicker from './ColorPicker';

/**
 * StoryToolbar component - Editor toolbar with formatting options
 * @param {Object} props
 * @param {Object} props.activeEditorRef - Reference to currently active editor
 * @param {Function} props.onSave - Callback when save button is clicked
 */
export default function StoryToolbar({ activeEditorRef, onSave }) {
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

  const handleImageChange = (e) => {
    if (!activeEditorRef.current) return;
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;

    const url = URL.createObjectURL(file);
    const img = document.createElement('img');
    img.src = url;
    img.className = 'max-w-full h-auto block mx-auto my-4 rounded-xl';
    placeBlock(activeEditorRef.current, img);

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
      <div className="sticky top-20 z-10 flex gap-2 flex-wrap bg-white dark:bg-darker-2 inset-shadow-2xs shadow-md rounded-sm p-2 mb-4">
        {/* Text Formatting */}
        <button
          onClick={handleBold}
          className="px-2.5 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-darker rounded-sm text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors dark:text-white"
          title="Bold (Ctrl+B)"
        >
          B
        </button>

        <button
          onClick={handleItalic}
          className="px-2.5 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-darker rounded-sm text-sm italic hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors dark:text-white"
          title="Italic (Ctrl+I)"
        >
          I
        </button>

        <button
          onClick={handleUnderline}
          className="px-2.5 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-darker rounded-sm text-sm underline hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors dark:text-white"
          title="Underline (Ctrl+U)"
        >
          U
        </button>

        {/* Divider */}
        <div className="w-px bg-gray-300 dark:bg-gray-700 mx-1" />

        {/* Heading */}
        <button
          onClick={handleH2}
          className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-darker rounded-sm text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors dark:text-white"
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
          <span>Tiêu đề</span>
        </button>

        {/* Video */}
        <button
          onClick={() => setIsVideoModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-darker rounded-sm text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors dark:text-white"
          title="Add Video"
        >
          <Video className="w-4 h-4" />
          <span>Video</span>
        </button>

        {/* Image */}
        <button
          onClick={handleImagePicker}
          className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-darker rounded-sm text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors dark:text-white"
          title="Upload Image/GIF"
        >
          <Image className="w-4 h-4" />
          <span>Ảnh/GIF</span>
        </button>

        {/* Divider */}
        <div className="w-px bg-gray-300 dark:bg-gray-700 mx-1" />

        {/* Color Picker */}
        <ColorPicker onColorSelect={handleColorChange} />

        {/* Save Button */}
        <button
          onClick={onSave}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-sm text-sm font-medium hover:bg-primary/90 transition-colors ml-auto"
          title="Save (Ctrl+S)"
        >
          <Save className="w-4 h-4" />
          <span>Lưu</span>
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
