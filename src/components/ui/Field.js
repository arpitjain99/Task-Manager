export function Field({ label, children }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-[#8888aa]">
      {label}
      {children}
    </label>
  );
}

export const inputClass =
  "w-full rounded-lg border border-bg-border bg-bg-elevated px-3.5 py-2.5 text-sm text-[#f0f0ff] outline-none transition placeholder:text-[#55556a] focus:border-accent focus:shadow-accent";
