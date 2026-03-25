import React, { useRef } from 'react';

interface ImageUploadProps {
  imageUrl?: string;
  onChange: (file: File | null) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ imageUrl, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange(file);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md bg-orange-50 flex items-center justify-center">
          {imageUrl ? (
            <img src={imageUrl} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span className="text-4xl">🐶</span>
          )}
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          type="button"
          className="absolute bottom-0 right-0 bg-amber-500 text-white w-9 h-9 rounded-full border-4 border-[#FDFBF7] flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
        >
          📷
        </button>
      </div>
      <div className="flex gap-2">
        <button onClick={() => fileInputRef.current?.click()} type="button" className="text-[11px] font-bold text-stone-500 hover:text-amber-600 transition-colors">사진 변경</button>
        {imageUrl && <button onClick={() => onChange(null)} type="button" className="text-[11px] font-bold text-red-400 hover:text-red-600 transition-colors">삭제</button>}
      </div>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
      <p className="text-[10px] text-stone-400 font-medium">우리 강아지의 가장 예쁜 사진을 골라주세요!</p>
    </div>
  );
};
