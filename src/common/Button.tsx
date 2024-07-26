import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  className?: string; // Allow className prop for additional classes
  color?: string; // Color prop with default value
}

const Button: React.FC<ButtonProps> = ({ size, children, className, color = 'secondary', ...props }) => {
  const getSizeStyles = (size: string): string => {
    switch (size) {
      case 'small':
        return 'py-1 px-2 text-sm';
      case 'medium':
        return 'py-2 px-4 text-base';
      case 'large':
        return 'py-3 px-6 text-lg';
      default:
        return '';
    }
  };

  const getColorClass = (color: string): string => {
    switch (color) {
      case 'primary':
        return 'bg-primary hover:bg-blue-700';
      case 'secondary':
        return 'bg-secondary hover:bg-red-200';
      default:
        return `bg-${color} hover:bg-${color}-dark`; // Example of using dynamic Tailwind classes for custom colors
    }
  };

  // Combine the default Tailwind classes with size-specific classes, color-specific classes, and any additional classes
  const buttonClasses = `border border-gray-600 text-white rounded-3xl transition-colors duration-300 shadow-lg ${getSizeStyles(size)} ${getColorClass(color)} ${className || ''}`;

  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;
