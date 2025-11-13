import { useRef, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  initializeStory,
  addBlank as addBlankAction,
  updateBlankTitle,
  updateBlankContent,
  reorderBlanks as reorderBlanksAction,
  deleteBlank as deleteBlankAction
} from '@/store/campaignSlice';
import { uid } from '@/utils/id';
import toast from 'react-hot-toast';

/**
 * Custom hook to manage blanks state with Redux
 */
function useBlanks() {
  const dispatch = useDispatch();
  const blanksById = useSelector((state) => state.campaign.story.blanksById);
  const order = useSelector((state) => state.campaign.story.order);
  const activeEditorRef = useRef(null);

  // Initialize with first blank if empty
  useEffect(() => {
    if (order.length === 0) {
      const firstId = uid();
      dispatch(initializeStory({
        id: firstId,
        blank: {
          id: firstId,
          titleHtml: 'Giới thiệu',
          titleText: 'Giới thiệu',
          contentHtml: '<p>Gõ nội dung câu chuyện dự án ở đây…</p>',
        },
      }));
    }
  }, [dispatch, order.length]);

  const addBlank = () => {
    const newId = uid();
    const newBlank = {
      id: newId,
      titleHtml: 'Untitled',
      titleText: 'Untitled',
      contentHtml: '',
    };
    dispatch(addBlankAction({ id: newId, blank: newBlank }));
    return newId;
  };

  const updateTitle = useCallback((id, titleHtml, titleText) => {
    dispatch(updateBlankTitle({ id, titleHtml, titleText }));
  }, [dispatch]);

  const updateContent = useCallback((id, contentHtml) => {
    dispatch(updateBlankContent({ id, contentHtml }));
  }, [dispatch]);

  const reorderBlanks = useCallback((newOrder) => {
    dispatch(reorderBlanksAction(newOrder));
  }, [dispatch]);

  const deleteBlank = useCallback((id) => {
    // Prevent deleting if it's the last blank
    if (order.length <= 1) {
      toast.error('Không thể xóa blank cuối cùng!');
      return;
    }

    dispatch(deleteBlankAction(id));
  }, [dispatch, order.length]);

  const setActiveEditor = (_id, editor) => {
    activeEditorRef.current = editor;
  };

  const scrollToBlank = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        const blank = blanksById[id];
        if (blank) {
          const editorElement = element.querySelector(
            '[contenteditable="true"]:last-child'
          );
          editorElement?.focus();
        }
      }, 350);
    }
  };

  const save = () => {
   console.log('Story đã được lưu tự động vào Redux store!');
  };

  // Derive blanks array from order and blanksById for rendering
  const blanks = order.map((id) => blanksById[id]).filter(Boolean);

  return {
    blanks,
    blanksById,
    order,
    activeEditorRef,
    addBlank,
    updateTitle,
    updateContent,
    reorderBlanks,
    deleteBlank,
    setActiveEditor,
    scrollToBlank,
    save,
  };
}
export default useBlanks;

