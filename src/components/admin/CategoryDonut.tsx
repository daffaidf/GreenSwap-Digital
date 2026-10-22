"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { usePrefersDark } from "./chart-theme";

export type CategorySlice = { name: string; value: number; color: string };

export function CategoryDonut({ data }: { data: CategorySlice[] }) {
  const dark = usePrefersDark();

  if (data.length === 0) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-xl bg-slate-50">
        <p className="text-sm text-slate-400">Belum ada barang terselamatkan.</p>
      </div>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="55%"
            outerRadius="85%"
            paddingAngle={3}
          >
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={entry.color ?? "#6b7280"}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: dark ? "#1e293b" : "#ffffff",
              color: dark ? "#f1f5f9" : "#111827",
              borderRadius: 12,
              border: dark ? "1px solid #334155" : "1px solid #e2e8f0",
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
