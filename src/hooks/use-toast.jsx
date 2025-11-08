import { toast as reactToastifyToast } from 'react-toastify';

export function toast({ variant, title, description }) {
  const message = description || title || '';
  
  if (variant === 'destructive') {
    reactToastifyToast.error(message);
  } else {
    reactToastifyToast.success(message);
  }
}

export { toast as default };

