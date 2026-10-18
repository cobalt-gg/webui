import {
  forwardRef,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
  type SelectHTMLAttributes,
  type ReactNode,
} from "react";
import { cx, type Size } from "./actions";
export interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  size?: Size;
  invalid?: boolean;
}
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { size = "md", invalid, className, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cx("ui-input", className)}
      data-size={size}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
});
export const SearchInput = forwardRef<HTMLInputElement, InputProps>(
  function SearchInput(props, ref) {
    return <Input ref={ref} {...props} type="search" />;
  },
);
export const NumberInput = forwardRef<HTMLInputElement, InputProps>(
  function NumberInput(props, ref) {
    return <Input ref={ref} {...props} type="number" />;
  },
);
export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cx("ui-input ui-textarea", className)}
      {...props}
    />
  );
});
export interface SelectProps extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "size"
> {
  size?: Size;
}
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ size = "md", className, ...props }, ref) {
    return (
      <select
        ref={ref}
        className={cx("ui-input ui-select", className)}
        data-size={size}
        {...props}
      />
    );
  },
);
export interface ChoiceProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label: ReactNode;
}
export const Checkbox = forwardRef<HTMLInputElement, ChoiceProps>(
  function Checkbox({ label, className, ...props }, ref) {
    return (
      <label className={cx("ui-choice", className)}>
        <input ref={ref} type="checkbox" {...props} />
        {label}
      </label>
    );
  },
);
export const Radio = forwardRef<HTMLInputElement, ChoiceProps>(function Radio(
  { label, className, ...props },
  ref,
) {
  return (
    <label className={cx("ui-choice", className)}>
      <input ref={ref} type="radio" {...props} />
      {label}
    </label>
  );
});
export const Slider = forwardRef<
  HTMLInputElement,
  Omit<InputHTMLAttributes<HTMLInputElement>, "type">
>(function Slider({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      type="range"
      className={cx("ui-slider", className)}
      {...props}
    />
  );
});
