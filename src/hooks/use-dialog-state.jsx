import { useState } from 'react';

/**
 * Custom hook để quản lý trạng thái của dialog
 * @param {any} initialState - Giá trị khởi tạo cho dialog state (thường là null hoặc false)
 * @returns {[any, function]} - Mảng chứa state và setState function
 */
const useDialogState = (initialState = null) => {
  const [dialogState, setDialogState] = useState(initialState);

  return [dialogState, setDialogState];
};

export default useDialogState;

