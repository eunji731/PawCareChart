import React from 'react';
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { ko } from 'date-fns/locale';

interface DatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  placeholderText?: string;
  className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({ 
  selected, 
  onChange, 
  placeholderText = "날짜 선택",
  className = ""
}) => {
  return (
    <div className={`custom-datepicker-container ${className}`}>
      <ReactDatePicker
        selected={selected}
        onChange={onChange}
        locale={ko}
        dateFormat="yyyy-MM-dd"
        placeholderText={placeholderText}
        className="w-full bg-transparent border-none outline-none text-[14px] font-black text-[#2D2D2D] cursor-pointer"
        
        /**
         * [최종 해결책]
         * 1. portalId를 지정하여 DOM 최상단에 렌더링 (부모 overflow 영향 제거)
         * 2. index.css에서 모바일 시 fixed + center 설정을 통해 잘림 방지
         */
        portalId="root-portal"
        popperPlacement="bottom-start"
        
        fixedHeight
        autoComplete="off"
      />
    </div>
  );
};
