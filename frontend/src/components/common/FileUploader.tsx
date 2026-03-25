import React, { useRef } from 'react';

interface FileUploaderProps {
  variant?: 'profile' | 'grid';
  mode?: 'single' | 'multiple';
  displayUrls: string[]; 
  onFileSelect: (files: File[]) => void;
  onFileDelete: (index: number) => void;
  loading?: boolean;
  maxCount?: number;
  accept?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  variant = 'grid',
  mode = 'single',
  displayUrls,
  onFileSelect,
  onFileDelete,
  loading = false,
  maxCount = 1,
  accept = 'image/*',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      onFileSelect(selectedFiles);
    }
    // 중요: 선택 직후 value 초기화하여 동일 파일 재선택 가능하게 함
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleDelete = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    onFileDelete(index);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // 1. 프로필 형태 UI (통합된 카드 헤더 감성)
  if (variant === 'profile') {
    const imageUrl = displayUrls[0];
    return (
      <div className="flex flex-col items-center w-full">
        <div className="relative group">
          {/* 이미지 영역: 둥근 사각형 보전 */}
          <div className="w-44 h-44 rounded-[40px] overflow-hidden border-4 border-white shadow-2xl bg-orange-50/50 flex items-center justify-center relative ring-1 ring-orange-100">
            {imageUrl ? (
              <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center opacity-20 select-none">
                <span className="text-6xl mb-1">🐶</span>
                <span className="text-[10px] font-black text-stone-500">PHOTO</span>
              </div>
            )}
            
            {loading && (
              <div className="absolute inset-0 bg-stone-900/40 flex items-center justify-center backdrop-blur-[1px]">
                <div className="w-7 h-7 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* 변경 버튼 (카메라) */}
          <button
            onClick={handleButtonClick}
            disabled={loading}
            type="button"
            className="absolute -bottom-1 -right-1 bg-amber-500 text-white w-11 h-11 rounded-2xl border-4 border-white flex items-center justify-center shadow-xl hover:bg-amber-600 hover:scale-110 active:scale-95 transition-all cursor-pointer disabled:opacity-50 z-10"
          >
            <span className="text-lg">📷</span>
          </button>
        </div>

        {/* 삭제 버튼: 사진 바로 아래 슬림하게 배치 */}
        {imageUrl && !loading && (
          <button
            onClick={(e) => handleDelete(e, 0)}
            type="button"
            className="mt-3 px-3 py-1 text-[11px] font-black text-stone-400 hover:text-red-500 transition-colors cursor-pointer rounded-full hover:bg-red-50"
          >
            ✕ 사진 삭제
          </button>
        )}
        
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept={accept} 
          className="hidden" 
        />
      </div>
    );
  }

  // 2. 그리드 형태 UI (확장용)
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
      {displayUrls.map((url, idx) => (
        <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-orange-100 shadow-sm">
          <img src={url} className="w-full h-full object-cover" alt="attachment" />
          <button
            onClick={(e) => handleDelete(e, idx)}
            className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs shadow-md cursor-pointer"
          >✕</button>
        </div>
      ))}
      {displayUrls.length < maxCount && (
        <button
          onClick={handleButtonClick}
          type="button"
          className="aspect-square rounded-2xl border-2 border-dashed border-orange-100 flex flex-col items-center justify-center text-stone-300 hover:border-amber-300 hover:text-amber-300 transition-all cursor-pointer bg-white/50"
        >
          <span className="text-2xl">+</span>
        </button>
      )}
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept={accept} className="hidden" multiple={mode === 'multiple'} />
    </div>
  );
};
