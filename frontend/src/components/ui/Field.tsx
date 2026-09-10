import type { InputHTMLAttributes } from 'react';

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Field({ label, error, className = '', ...props }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[#2E2E2E]">{label}</label>
      <input
        className={`border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#5FA8D3] ${
          error ? 'border-[#E0212B]' : ''
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-[#E0212B]">{error}</span>}
    </div>
  );
}
