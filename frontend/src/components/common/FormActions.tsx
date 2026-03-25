import React from 'react';

interface FormActionsProps {
  onCancel: () => void;
  onSave: () => void;
  isSubmitting?: boolean;
  saveLabel?: string;
  cancelLabel?: string;
}

export const FormActions: React.FC<FormActionsProps> = ({ 
  onCancel, 
  onSave, 
  isSubmitting, 
  saveLabel = '저장하기', 
  cancelLabel = '취소' 
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-end gap-3 mt-10 pt-6 border-t border-orange-100">
      <button
        onClick={onCancel}
        type="button"
        className="w-full sm:w-32 px-4 py-2.5 text-[14px] font-bold text-stone-400 hover:text-stone-600 transition-colors"
      >
        {cancelLabel}
      </button>
      <button
        onClick={onSave}
        disabled={isSubmitting}
        type="button"
        className="w-full sm:w-48 bg-amber-500 text-white px-6 py-2.5 rounded-xl text-[14px] font-black shadow-lg shadow-amber-200 hover:bg-amber-600 transition-all disabled:opacity-50"
      >
        {isSubmitting ? '처리 중...' : saveLabel}
      </button>
    </div>
  );
};
