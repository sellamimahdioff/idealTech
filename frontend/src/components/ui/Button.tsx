import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

const variantClasses: Record<Variant, string> = {
  primary: 'bg-[#E0212B] text-white hover:opacity-90',
  secondary:
    'bg-white border border-[#1B3A57] text-[#1B3A57] hover:bg-[#1B3A57] hover:text-white',
  ghost: 'bg-transparent text-[#1B3A57] hover:bg-gray-100',
  danger: 'bg-white border border-[#E0212B] text-[#E0212B] hover:bg-[#E0212B] hover:text-white',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition disabled:opacity-40 disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}
