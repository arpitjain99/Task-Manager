export function StatCard({ icon: Icon, label, value, tone, helper }) {
  return (
    <div className="rounded-card border border-bg-border bg-bg-surface p-6 shadow-card">
      <div className="flex items-center gap-3 text-sm text-[#8888aa]">
        <span className="rounded-full p-2" style={{ backgroundColor: `${tone}22`, color: tone }}>
          <Icon size={20} />
        </span>
        {label}
      </div>
      <div className="mt-5 text-4xl font-bold text-white">{value}</div>
      <p className="mt-2 text-xs text-[#55556a]">{helper}</p>
    </div>
  );
}
