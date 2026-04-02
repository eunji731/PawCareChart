/**
 * 파일 관련 유틸리티
 */

export const isImageFile = (url: string, fileName?: string): boolean => {
  if (!url) return false;
  
  // 확장자 추출 (파일명이 있으면 우선, 없으면 URL에서)
  const nameToCheck = fileName || url;
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
  const extension = nameToCheck.split('.').pop()?.toLowerCase();
  
  return extension ? imageExtensions.includes(extension) : false;
};

export const getFileExtension = (url: string, fileName?: string): string => {
  const nameToCheck = fileName || url;
  if (!nameToCheck) return '';
  return nameToCheck.split('.').pop()?.toLowerCase() || '';
};

export const getFileNameFromUrl = (url: string): string => {
  if (!url) return '';
  if (url.startsWith('blob:')) return '새 파일';
  const parts = url.split('/');
  const fullName = parts[parts.length - 1];
  return decodeURIComponent(fullName.split('?')[0]); // 인코딩된 한글 처리
};

export const getFileIcon = (extension: string): string => {
  switch (extension) {
    case 'pdf': return '📄';
    case 'xls':
    case 'xlsx': return '📊';
    case 'doc':
    case 'docx': return '📝';
    case 'hwp': return '📒';
    case 'zip':
    case 'rar':
    case '7z': return '📦';
    default: return '📁';
  }
};
