import { cn } from "@/lib/utils";
type Props = { className?: string };
const LoadingSpinner = ({ className }: Props) => {
  return (
    <div
      className={cn(
        "inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent",
        className,
      )}
    />
  );
};

export default LoadingSpinner;
