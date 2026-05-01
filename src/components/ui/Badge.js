import { clsx } from "clsx";

const statusStyles = {
  TODO: "bg-blue-500/10 text-blue-300",
  IN_PROGRESS: "bg-amber-500/10 text-amber-300",
  DONE: "bg-emerald-500/10 text-emerald-300",
};

const roleStyles = {
  ADMIN: "bg-accent/20 text-indigo-200",
  MEMBER: "bg-emerald-500/15 text-emerald-200",
};

export function Badge({ children, type = "status", value }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        type === "role" ? roleStyles[value] : statusStyles[value]
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}
