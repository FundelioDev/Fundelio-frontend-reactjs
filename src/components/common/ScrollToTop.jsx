import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Component tự động scroll về đầu trang khi route thay đổi
 */
export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant', // 'smooth' nếu muốn scroll mượt
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;

