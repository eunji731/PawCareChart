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
        popperPlacement="bottom-end"
        // 다음 달 이동 버튼 등 커스텀 가능
      />
    </div>
  );
};
