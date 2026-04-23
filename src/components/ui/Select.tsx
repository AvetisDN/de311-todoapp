import React, { useState, useEffect, useRef } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  className?: string;
  icon?: React.ReactNode;
}

const Select = ({
  value,
  onChange,
  options = [],
  placeholder,
  icon,
  className,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={selectRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "inline-flex items-center gap-2 py-3 px-4 pr-3.5 font-medium border border-border rounded-lg",
          className,
        )}
      >
        {icon}
        {!selectedOption && (
          <span className="text-muted-foregound">{placeholder}</span>
        )}
        {selectedOption && <span>{selectedOption.label}</span>}
        <ChevronDown
          className="w-4 h-4 ml-auto transition duration-300"
          style={{ rotate: isOpen ? "-180deg" : "0deg" }}
        />
      </button>

      {isOpen && (
        <div className="absolute z-30 py-2 shadow-lg bg-popover w-full mt-2 rounded-lg animate-fadeIn">
          <div className="flex flex-col gap-1">
            {options.map((option, index) => (
              <button
                key={index}
                className={cn(
                  "w-full px-4 py-2 text-left text-sm transition-colors flex items-center justify-between gap-2 hover:bg-destructive hover:text-destructive-foreground",
                  value === option.value ? "bg-primary/20" : "",
                )}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                <span>{option.label}</span>
                {value === option.value && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Select;
