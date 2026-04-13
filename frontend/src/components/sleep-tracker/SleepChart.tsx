"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SleepData } from "./page";

export default function SleepChart({ data }: { data: SleepData[] }) {
  return (
    <Card className="border border-gray-200 bg-white">
      <CardHeader>
        <CardTitle className="text-lg">Sleep Pattern</CardTitle>
        <CardDescription>Hours slept per day this month</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 16]} />
            <Tooltip formatter={(value) => [`${value ?? 0}h`, "Sleep"]} />
            <Line
              type="monotone"
              dataKey="hours"
              stroke="#2563eb"
              dot={{ r: 4 }}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
