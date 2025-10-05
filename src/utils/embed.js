/**
 * Build video embed iframe from URL
 * Supports YouTube and Vimeo
 * @param {string} url - Video URL
 * @returns {HTMLIFrameElement|null} iframe element or null if not supported
 */
export function buildVideoEmbed(url) {
  try {
    const u = new URL(url);

    // YouTube support
    if (u.hostname.includes('youtube.com')) {
      const v = u.searchParams.get('v');
      if (!v) return null;
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${v}`;
      iframe.allowFullscreen = true;
      iframe.className = 'w-full aspect-video rounded-xl my-4';
      return iframe;
    }

    // YouTube short URL support
    if (u.hostname === 'youtu.be') {
      const id = u.pathname.slice(1);
      if (!id) return null;
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${id}`;
      iframe.allowFullscreen = true;
      iframe.className = 'w-full aspect-video rounded-xl my-4';
      return iframe;
    }

    // Vimeo support
    if (u.hostname.includes('vimeo.com')) {
      const id = u.pathname.split('/').filter(Boolean).pop();
      if (!id) return null;
      const iframe = document.createElement('iframe');
      iframe.src = `https://player.vimeo.com/video/${id}`;
      iframe.allowFullscreen = true;
      iframe.className = 'w-full aspect-video rounded-xl my-4';
      return iframe;
    }

    return null;
  } catch {
    return null;
  }
}
