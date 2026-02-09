const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1';
const API_ORIGIN = API_BASE.replace(/\/api\/v1\/?$/, '');

export const getImageUrl = (image) => {
  if (!image) return '';
  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image;
  }
  if (image.startsWith('/images/')) {
    return `${API_ORIGIN}${image}`;
  }
  return image;
};
