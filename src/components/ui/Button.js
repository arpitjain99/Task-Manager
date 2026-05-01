import { clsx } from "clsx";

export function Button({ className, variant = "primary", ...props }) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" && "bg-accent text-white hover:bg-accent-hover hover:shadow-[0_4px_12px_rgba(99,102,241,0.35)]",
        variant === "ghost" && "border border-bg-border bg-transparent text-[#f0f0ff] hover:bg-bg-hover",
        variant === "danger" && "bg-red-500/15 text-red-300 hover:bg-red-500/25",
        className
      )}
      {...props}
    />
  );
}
