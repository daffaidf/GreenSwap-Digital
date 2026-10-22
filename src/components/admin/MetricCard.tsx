import { LucideIcon } from "lucide-react";

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon?: LucideIcon;
  trend?: string;
}) {
  return (
    <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-xs transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        {Icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      <div className="mt-3 text-2xl sm:text-3xl font-black text-slate-900">{value}</div>
      <div className="mt-1.5 flex items-center justify-between text-xs text-slate-500">
        <span>{subtitle}</span>
        {trend && (
          <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
