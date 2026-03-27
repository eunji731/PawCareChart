import React, { useState } from 'react';
import type { FileItem } from '@/types/file';

interface CareRecordAttachmentGalleryProps {
  files: FileItem[];
}

export const CareRecordAttachmentGallery: React.FC<CareRecordAttachmentGalleryProps> = ({ files }) => {
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  if (files.length === 0) return null;

  return (
    <section>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-[15px] font-black text-[#2D2D2D] tracking-widest uppercase flex items-center gap-2.5">
          <span className="text-[18px]">📷</span> Attachment Gallery
        </h2>
        <span className="text-[12px] font-black text-stone-400 uppercase tracking-widest">{files.length} Files</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-5">
        {files.map((file) => (
          <div 
            key={file.id}
            onClick={() => setSelectedFile(file)}
            className="aspect-square rounded-[20px] overflow-hidden cursor-pointer group border border-stone-100 bg-stone-50 transition-all hover:border-[#FF6B00]/30 hover:shadow-xl hover:shadow-orange-500/5 focus:outline-none"
          >
            {file.fileType.startsWith('image/') ? (
              <img 
                src={file.fileUrl} 
                alt={file.originalFileName} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                <span className="text-4xl grayscale opacity-30 group-hover:opacity-100 group-hover:grayscale-0 transition-all transform group-hover:scale-110">📄</span>
                <span className="text-[10px] font-bold text-stone-400 px-4 text-center line-clamp-1">{file.originalFileName}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Image Viewer Modal */}
      {selectedFile && (
        <div 
          className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-stone-900/95 backdrop-blur-xl animate-in fade-in duration-300"
          onClick={() => setSelectedFile(null)}
        >
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center">
            <button 
              className="absolute -top-16 right-0 text-white/40 hover:text-white transition-colors text-3xl"
              onClick={() => setSelectedFile(null)}
            >
              ✕
            </button>
            
            {selectedFile.fileType.startsWith('image/') ? (
              <img 
                src={selectedFile.fileUrl} 
                alt={selectedFile.originalFileName} 
                className="max-w-full max-h-[80vh] object-contain rounded-3xl shadow-2xl"
              />
            ) : (
              <div className="bg-white p-12 rounded-[40px] flex flex-col items-center gap-10 shadow-2xl">
                <span className="text-8xl">📄</span>
                <div className="text-center">
                  <p className="text-[#2D2D2D] font-black text-2xl mb-3 tracking-tight">{selectedFile.originalFileName}</p>
                  <p className="text-stone-400 text-sm font-medium">이 파일은 미리보기를 지원하지 않습니다.</p>
                </div>
                <a 
                  href={selectedFile.fileUrl} 
                  download 
                  className="bg-stone-900 text-white px-12 py-5 rounded-[24px] font-black text-[16px] shadow-2xl active:scale-95 transition-all"
                  onClick={(e) => e.stopPropagation()}
                >
                  파일 다운로드
                </a>
              </div>
            )}
            
            <p className="mt-8 text-white/30 text-[13px] font-bold tracking-widest uppercase">{selectedFile.originalFileName}</p>
          </div>
        </div>
      )}
    </section>
  );
};
