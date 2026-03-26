import React, { useRef } from 'react';

interface FileUploaderProps {
  variant?: 'profile' | 'grid' | 'panel';
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

  // 1. 프리미엄 패널 형태 (등록/수정 페이지 좌측용)
  if (variant === 'panel') {
    const imageUrl = displayUrls[0];
    return (
      <div className="relative w-full aspect-[4/5] rounded-[32px] overflow-hidden group bg-[#F9F7F5] border border-stone-100 shadow-inner">
        {imageUrl ? (
          <>
            <img src={imageUrl} alt="Preview" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
              <div className="text-white">
                <p className="text-[10px] font-black tracking-[0.2em] opacity-60 uppercase mb-1">Selected Image</p>
                <p className="text-[14px] font-bold opacity-90 italic">Ready to archive</p>
              </div>
              <button onClick={(e) => handleDelete(e, 0)} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-red-500 transition-all active:scale-90 flex items-center justify-center">✕</button>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-10 text-center">
            <span className="text-6xl mb-6 opacity-10">🐕</span>
            <h5 className="text-[18px] font-black text-stone-300 tracking-tight mb-2">No Photo.</h5>
            <p className="text-[13px] text-stone-400 font-medium leading-relaxed opacity-60">
              아이를 가장 잘 나타내는 <br /> 사진을 등록해주세요.
            </p>
          </div>
        )}

        <div className={`absolute inset-0 bg-stone-900/40 flex items-center justify-center backdrop-blur-[2px] transition-opacity duration-300 ${loading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        </div>

        {!imageUrl && !loading && (
          <button onClick={handleButtonClick} className="absolute inset-0 w-full h-full cursor-pointer z-10" title="사진 업로드" />
        )}
        
        {imageUrl && !loading && (
          <button onClick={handleButtonClick} className="absolute top-6 right-6 w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-xl hover:scale-110 active:scale-90 transition-all">📷</button>
        )}

        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept={accept} className="hidden" />
      </div>
    );
  }

  // 2. 기본 프로필 형태 (필요 시 유지)
  if (variant === 'profile') {
    const imageUrl = displayUrls[0];
    return (
      <div className="flex flex-col items-center">
        <div className="relative group">
          <div className="w-44 h-44 rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-[#F9F7F5] flex items-center justify-center relative">
            {imageUrl ? <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" /> : <span className="text-5xl opacity-10">🐶</span>}
            {loading && <div className="absolute inset-0 bg-stone-900/40 flex items-center justify-center"><div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" /></div>}
          </div>
          <button onClick={handleButtonClick} disabled={loading} className="absolute -bottom-2 -right-2 bg-[#FF6B00] text-white w-11 h-11 rounded-2xl border-4 border-white flex items-center justify-center shadow-lg hover:scale-110 transition-all">📷</button>
        </div>
        {imageUrl && <button onClick={(e) => handleDelete(e, 0)} className="mt-4 text-[12px] font-black text-stone-300 hover:text-red-500 transition-colors">✕ 사진 삭제</button>}
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept={accept} className="hidden" />
      </div>
    );
  }

  // 3. 그리드 형태
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
      {displayUrls.map((url, idx) => (
        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-stone-100 shadow-sm">
          <img src={url} className="w-full h-full object-cover" alt="attachment" />
          <button onClick={(e) => handleDelete(e, idx)} className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px]">✕</button>
        </div>
      ))}
      <button onClick={handleButtonClick} className="aspect-square rounded-xl border-2 border-dashed border-stone-100 flex items-center justify-center text-stone-300 hover:border-[#FF6B00] transition-all">+</button>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept={accept} className="hidden" multiple={mode === 'multiple'} />
    </div>
  );
};
