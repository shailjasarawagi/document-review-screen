/* Button Component
 * A reusable and customizable Button component with support for multiple variants, sizes, and states.
 * Variants: "default", "outline", "ghost"
 * Sizes: "sm", "md", "lg"
 * Accessibility: Supports custom ARIA labels for better accessibility.
 */
import type React from "react";

import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  ariaLabel?: string;
}

// ForwardRef allows the button component to forward its ref to the DOM button element
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "default",
      size = "md",
      children,
      disabled,
      ariaLabel,
      ...props
    },
    ref
  ) => {
    // Base styles for all button variants and sizes
    const baseClasses =
      " inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      default:
        "w-full bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700",
      outline:
        "w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700",
      ghost:
        " text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
    };

    const sizes = {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-base",
    };

    const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled}
        aria-label={ariaLabel || ""}
        {...props}
      >
        {children}
      </button>
    );
  }
);
