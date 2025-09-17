import { cn } from '@/lib/utils';
import * as React from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

type InputProps = {
  /** Label text for the input */
  label?: string;
  /** Tailwind classes for the label */
  labelClassName?: string;
  /** Tailwind classes for the parent div */
  parentDivClasses?: string;
  /** Optional icon to display inside the input (e.g., for password fields) */
  icon?: React.ReactNode;
  /** Whether the input is a password field with toggle functionality */
  isPassword?: boolean;
} & React.ComponentProps<'input'>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, labelClassName, parentDivClasses, icon, isPassword, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(prev => !prev);
    };

    return (
      <div className={` w-full ${parentDivClasses}`}>
        {/* Label */}
        {label && (
          <label
            className={cn(
              'block text-sm font-medium text-[#6B778C] mb-2',
              labelClassName, // Custom Tailwind classes for the label
            )}
          >
            {label}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Input */}
          <input
            type={isPassword ? (showPassword ? 'text' : 'password') : type}
            className={cn(
              'flex text-sm w-full py-2 xl:py-3 px-3 border border-[#CBD5E1] focus:outline-none focus:border-[#F7353A] rounded-lg md:rounded-xl bg-[#F4F5F7] text-[#11121A]  shadow-sm transition-colors file:bg-none file:text-sm file:font-medium file:text-foreground placeholder:text-[#B2B2B2] focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-base',
              className,
              {
                'pr-10': icon || isPassword, // Add padding to the right if an icon or password toggle is present
              },
            )}
            ref={ref}
            {...props}
          />

          {/* Icon or Password Toggle */}
          {isPassword
            ? (
                <button
                  type="button"
                  className="absolute inset-y-0 right-4 flex items-center justify-center focus:outline-none"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
                </button>
              )
            : (
                icon && (
                  <div className="absolute inset-y-0 right-4 flex items-center justify-center">
                    {icon}
                  </div>
                )
              )}
        </div>
      </div>
    );
  },
);

Input.displayName = 'Input';

export { Input };
