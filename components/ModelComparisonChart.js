"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";

const data = [
  { feat: 2, xgb: 0.89, rf: 0.88, lr: 0.88 },
  { feat: 3, xgb: 0.90, rf: 0.91, lr: 0.88 },
  { feat: 4, xgb: 0.94, rf: 0.92, lr: 0.92 },
  { feat: 5, xgb: 0.94, rf: 0.93, lr: 0.93 },
  { feat: 6, xgb: 0.95, rf: 0.94, lr: 0.97 },
  { feat: 7, xgb: 0.94, rf: 0.95, lr: 0.94 },
  { feat: 8, xgb: 0.95, rf: 0.93, lr: 0.94 },
  { feat: 9, xgb: 0.92, rf: 0.93, lr: 0.94 },
  { feat: 10, xgb: 0.94, rf: 0.93, lr: 0.93 },
  { feat: 11, xgb: 0.94, rf: 0.94, lr: 0.92 },
  { feat: 12, xgb: 0.94, rf: 0.93, lr: 0.91 },
];

export default function ModelComparisonChart() {
  return (
    <div className="w-full h-96 cursor-pointer">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="feat" label={{ value: "No. of Features", position: "insideBottom", offset: -5 }} />
          <YAxis domain={[0.85, 1]} label={{ value: "Score", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="xgb" stroke="#ff7300" strokeWidth={2} name="XGBoost" />
          <Line type="monotone" dataKey="rf" stroke="#387908" strokeWidth={2} name="Random Forest" />
          <Line type="monotone" dataKey="lr" stroke="#8884d8" strokeWidth={2} name="Logistic Regression" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
