// Path: components/Button.tsx
import { cva } from "class-variance-authority";
 
type ButtonProps = React.HTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "tertiary" | "fourthiary" |"success" | "failure";
  size?: "sm" | "md" | "lg" | "xl";
  type?: "button" | "submit" | "reset";
  className?: string;
  onSubmit?: (event: React.FormEvent<HTMLButtonElement>) => void; // Added onSubmit event type
};
 
const buttonVariants = cva("flex text-center items-center", {
  variants: {
    variant: {
        primary: "bg-[#177BDA] hover:bg-[#146CBE] active:bg-[#125FA8] disabled:bg-gray-400 rounded-md gap-2  text-white cursor-pointer",
      secondary:
        "bg-secondary hover:bg-secondary_hover active:bg-secondary_active disabled:bg-secondary_disabled rounded-md gap-2 border border-outlineButton text-outlineButton cursor-pointer",
      tertiary:
        "bg-tertiary hover:bg-tertiary_hover active:bg-tertiary_active disabled:bg-tertiary_disabled rounded-md gap-2 border border-outlineButton text-outlineButton cursor-pointer",
      fourthiary:
        "bg-fourthiary_main hover:bg-fourthiary_hover active:bg-fourthiary_active disabled:bg-fourthiary_disabled rounded-md gap-2 border border-gray-500 text-white cursor-pointer",
      success:
        "bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:bg-green-400 rounded-md gap-2 border border-green-700 text-white cursor-pointer",
      failure:
        "bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:bg-red-400 rounded-md gap-2 border border-red-700 text-white cursor-pointer",
    },
    size: {
      sm: "px-[0.625rem] py-2 rounded-[8px]",
      md: "px-[1rem] py-2  rounded-lg",
      lg: "px-4 py-3 rounded-lg ",
      xl: "px-4 py-3 rounded-lg",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});
 
export default function Button({
  variant = "primary",
  size = "md",
  className = "p-4",
  type = "button",
  onSubmit, // Added onSubmit prop
  ...props
}: ButtonProps) {
  const combinedClassName = `${buttonVariants({ variant, size })} ${className}`;
 
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (type === "submit" && onSubmit) {
      onSubmit(event as any); // Cast to `any` to simulate `onSubmit` behavior
    }
 
    if (props.onClick) {
      props.onClick(event);
    }
  };
 
  return (
<button
      type={type}
      {...props}
      className={combinedClassName}
      onClick={handleClick} // Use handleClick to trigger onSubmit if type is "submit"
    />
  );
}