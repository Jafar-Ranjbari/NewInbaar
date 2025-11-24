"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const lineData = [
  { name: "Mon", value: 0.32 },
  { name: "Tue", value: 0.28 },
  { name: "Wed", value: 0.45 },
  { name: "Thu", value: 0.38 },
  { name: "Fri", value: 0.52 },
  { name: "Sat", value: 0.49 },
  { name: "Sun", value: 0.61 },
];

export default function LineWalletChart() {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer>
        <LineChart data={lineData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#f7931a" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
