export type SocialMediaType = 'youtube' | 'facebook' | 'instagram' | 'unknown';
export type SocialContentType = 'reel' | 'post' | 'video' | 'unknown';

export interface SocialMediaInfo {
  type: SocialMediaType;
  contentType: SocialContentType;
  embedUrl: string;
  badgeLabel: string;
}

/**
 * Extrae el código de Instagram (Reels, Posts, TV) y construye la URL de inserción (embed).
 * Maneja URLs sin barra final, con parámetros de consulta (?igsh=...), etc.
 */
export const getInstagramEmbedUrl = (url: string): string => {
  if (!url) return '';
  const cleanUrl = url.trim();
  const match = cleanUrl.match(/(?:instagram\.com|instagr\.am)\/(?:p|reel|reels|tv)\/([A-Za-z0-9_-]+)/i);
  if (match && match[1]) {
    const code = match[1];
    return `https://www.instagram.com/p/${code}/embed/`;
  }
  return cleanUrl;
};

/**
 * Obtiene el tipo específico de contenido de Instagram (Reel, Publicación, Video).
 */
export const getInstagramContentType = (url: string): SocialContentType => {
  if (!url) return 'unknown';
  if (/\/(reel|reels)\//i.test(url)) return 'reel';
  if (/\/(tv)\//i.test(url)) return 'video';
  if (/\/(p)\//i.test(url)) return 'post';
  return 'video';
};

/**
 * Obtiene la etiqueta amigable para mostrar en las miniaturas de Instagram.
 */
export const getInstagramBadgeLabel = (url: string): string => {
  const type = getInstagramContentType(url);
  switch (type) {
    case 'reel':
      return 'Reel';
    case 'post':
      return 'Publicación';
    case 'video':
      return 'Video IGTV';
    default:
      return 'Instagram';
  }
};

/**
 * Limpia parámetros de seguimiento de URLs de Facebook (mibextid, rdid, sfnsn, etc.)
 */
export const cleanFacebookUrl = (url: string): string => {
  if (!url) return '';
  let clean = url.trim();
  try {
    const parsed = new URL(clean);
    const paramsToStrip = ['mibextid', 'rdid', 'sfnsn', 's', 'fbclid', '_rdr', 'ref', 'notif_id', 'notif_t'];
    paramsToStrip.forEach(p => parsed.searchParams.delete(p));
    clean = parsed.toString();
  } catch {
    clean = clean.replace(/[?&](mibextid|rdid|sfnsn|s|fbclid|_rdr|ref|notif_id|notif_t)=[^&]*/gi, '');
  }
  return clean;
};

/**
 * Genera la URL de embed adecuada para Facebook (video.php vs post.php).
 * Soporta Reels, Videos de Facebook Watch, enlaces compartidos (share/v, share/r) y Publicaciones estándar.
 */
export const getFacebookEmbedUrl = (url: string): string => {
  if (!url) return '';
  const cleanUrl = cleanFacebookUrl(url);

  // Videos de Facebook Watch y /videos/ usan video.php.
  // Publicaciones, fotos, permalinks y Reels de Facebook usan post.php.
  const isVideo = /\/(videos|watch)\//i.test(cleanUrl);
  const pluginType = isVideo ? 'video.php' : 'post.php';

  return `https://www.facebook.com/plugins/${pluginType}?href=${encodeURIComponent(cleanUrl)}&show_text=false&width=500`;
};

/**
 * Obtiene el tipo de contenido específico de Facebook.
 */
export const getFacebookContentType = (url: string): SocialContentType => {
  if (!url) return 'unknown';
  if (/\/(reel|reels)\//i.test(url)) return 'reel';
  if (/\/(posts|photos|permalink\.php|groups)\//i.test(url)) return 'post';
  return 'video';
};

/**
 * Obtiene la etiqueta amigable para mostrar en las miniaturas de Facebook.
 */
export const getFacebookBadgeLabel = (url: string): string => {
  const type = getFacebookContentType(url);
  switch (type) {
    case 'reel':
      return 'Facebook Reel';
    case 'post':
      return 'Publicación';
    case 'video':
      return 'Video FB';
    default:
      return 'Facebook';
  }
};

/**
 * Extrae el ID de un video de YouTube.
 */
export const getYouTubeVideoId = (url: string): string | null => {
  if (!url) return null;
  const match = url.match(
    /(?:https?:\/\/(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/))([^?\s&]+)/i
  );
  return match ? match[1] : null;
};

/**
 * Obtiene la URL de la miniatura de un video de YouTube.
 */
export const getYouTubeThumbnailUrl = (url: string): string => {
  const id = getYouTubeVideoId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
};
