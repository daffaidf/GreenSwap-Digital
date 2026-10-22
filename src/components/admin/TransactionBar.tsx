"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { usePrefersDark } from "./chart-theme";

export type RatioDatum = { name: string; value: number; color: string };

export function TransactionBar({ data }: { data: RatioDatum[] }) {
  const dark = usePrefersDark();
  const tick = dark ? "#94a3b8" : "#64748b";
  const grid = dark ? "#1e293b" : "#e2e8f0";

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={grid} />
          <XAxis dataKey="name" tick={{ fill: tick, fontSize: 13 }} />
          <YAxis allowDecimals={false} tick={{ fill: tick, fontSize: 13 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: dark ? "#1e293b" : "#ffffff",
              color: dark ? "#f1f5f9" : "#111827",
              borderRadius: 12,
              border: dark ? "1px solid #334155" : "1px solid #e2e8f0",
            }}
          />
          <Bar dataKey="value" name="Transaksi" radius={[8, 8, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
