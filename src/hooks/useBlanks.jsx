import { useState, useRef, useEffect, useCallback } from 'react';
import { uid } from '@/utils/id';
import toast from 'react-hot-toast';
/**
 * Custom hook to manage blanks state and operations
 */
function useBlanks() {
  const [blanks, setBlanks] = useState([]);
  const activeEditorRef = useRef(null);
  const autosaveTimerRef = useRef(null);

  // Initialize with first blank
  useEffect(() => {
    const firstId = uid();
    setBlanks([
      {
        id: firstId,
        order: 0,
        titleHtml: 'Giới thiệu',
        titleText: 'Giới thiệu',
        contentHtml: '<p>Gõ nội dung câu chuyện dự án ở đây…</p>',
      },
    ]);
  }, []);

  const addBlank = () => {
    const newId = uid();
    const newBlank = {
      id: newId,
      order: blanks.length,
      titleHtml: 'Untitled',
      titleText: 'Untitled',
      contentHtml: '',
    };
    setBlanks((prev) => [...prev, newBlank]);
    return newId;
  };

  const updateTitle = useCallback((id, titleHtml, titleText) => {
    setBlanks((prev) =>
      prev.map((blank) =>
        blank.id === id ? { ...blank, titleHtml, titleText } : blank
      )
    );
    scheduleAutosave();
  }, []);

  const updateContent = useCallback((id, contentHtml) => {
    setBlanks((prev) =>
      prev.map((blank) => (blank.id === id ? { ...blank, contentHtml } : blank))
    );
    scheduleAutosave();
  }, []);

  const setActiveEditor = (_id, editor) => {
    activeEditorRef.current = editor;
  };

  const scrollToBlank = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        const blank = blanks.find((b) => b.id === id);
        if (blank) {
          const editorElement = element.querySelector(
            '[contenteditable="true"]:last-child'
          );
          editorElement?.focus();
        }
      }, 350);
    }
  };

  const getPayload = () => {
    const payload = {
      version: 1,
      createdAt: new Date().toISOString(),
      blanks: blanks.map((blank, index) => ({
        id: blank.id,
        order: index,
        title_text: blank.titleText,
        title_html: blank.titleHtml,
        content_html: blank.contentHtml,
      })),
    };
    return payload;
  };

  const scheduleAutosave = () => {
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }
    autosaveTimerRef.current = setTimeout(() => {
      const payload = getPayload();
      console.log('[AUTOSAVE]', payload);
    }, 5000);
  };

  const save = () => {
    const payload = getPayload();
    console.log('SAVE payload:', payload);
    console.log('\n=== Mock Data JSON ===\n', JSON.stringify(payload, null, 2));
    toast.success('Đã lưu thành công!');
  };

  return {
    blanks,
    activeEditorRef,
    addBlank,
    updateTitle,
    updateContent,
    setActiveEditor,
    scrollToBlank,
    save,
  };
}
export default useBlanks;

