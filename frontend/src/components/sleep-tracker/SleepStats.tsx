"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function SleepStats({
  average,
  daysTracked,
}: {
  average: string;
  daysTracked: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="border border-gray-200 bg-white">
        <CardContent className="pt-6">
          <p className="text-sm text-gray-600 mb-1">Average Sleep</p>
          <p className="text-2xl font-bold text-gray-900">{average}h</p>
        </CardContent>
      </Card>

      <Card className="border border-gray-200 bg-white">
        <CardContent className="pt-6">
          <p className="text-sm text-gray-600 mb-1">Days Tracked</p>
          <p className="text-2xl font-bold text-gray-900">{daysTracked}</p>
        </CardContent>
      </Card>
    </div>
  );
}
