import React, { useRef } from 'react';
import { formatChemicalFormula } from '../utils/chemistry';
import { Sparkles } from 'lucide-react';

interface SmartFormulaInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  disabled?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
}

export const SmartFormulaInput: React.FC<SmartFormulaInputProps> = ({
  value,
  onChange,
  onSubmit,
  disabled = false,
  placeholder = 'Type products, e.g. 2NaCl + Br2',
  autoFocus = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSubmit && !disabled) {
      e.preventDefault();
      onSubmit();
    }
  };

  const insertSymbol = (symbol: string) => {
    if (disabled || !inputRef.current) return;
    const input = inputRef.current;
    const start = input.selectionStart || value.length;
    const end = input.selectionEnd || value.length;

    const newValue = value.slice(0, start) + symbol + value.slice(end);
    onChange(newValue);

    setTimeout(() => {
      input.focus();
      const newPos = start + symbol.length;
      input.setSelectionRange(newPos, newPos);
    }, 10);
  };

  const renderedFormula = formatChemicalFormula(value);

  return (
    <div className="w-full space-y-2">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all disabled:bg-slate-100 disabled:text-slate-400 placeholder:text-slate-400 shadow-sm"
        />

        {value.trim() && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-200 pointer-events-none">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-mono font-medium text-slate-800">{renderedFormula}</span>
          </div>
        )}
      </div>

      {/* Quick Chemistry Character Helpers */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-slate-600 font-medium mr-1">Quick keys:</span>
          {['+', '₂', '₃', '₄', '(', ')'].map((sym) => (
            <button
              key={sym}
              type="button"
              disabled={disabled}
              onClick={() => insertSymbol(sym)}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 disabled:opacity-50 text-slate-800 font-mono text-sm rounded border border-slate-200 transition-colors"
            >
              {sym}
            </button>
          ))}
        </div>

        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange('No Reaction')}
          className="px-2.5 py-1 text-xs font-semibold text-rose-800 bg-rose-50 hover:bg-rose-100 disabled:opacity-50 border border-rose-200 rounded transition-colors"
        >
          Insert "No Reaction"
        </button>
      </div>
    </div>
  );
};
