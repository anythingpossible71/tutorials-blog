"use client";

import { useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";

interface GrowingTitleInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function GrowingTitleInput({ 
  value, 
  onChange, 
  placeholder = "Add your title here",
  className = ""
}: GrowingTitleInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      // Reset height to auto to get the correct scrollHeight
      inputRef.current.style.height = 'auto';
      // Set the height to match the content
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <Input
      ref={inputRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`text-4xl font-bold border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-[#dddddd] resize-none overflow-hidden p-0 ${className}`}
      style={{
        minHeight: 'auto',
        height: 'auto',
        lineHeight: '1.2',
        fontSize: '2.25rem',
        fontWeight: '700'
      }}
    />
  );
}
