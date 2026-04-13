"use client";

import { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { X, Check, CircleDashed } from "lucide-react";

export default function HabitRow({
  habit,
  days,
  today,
  checked,
  onToggle,
  onDelete,
}: {
  habit: string;
  days: Array<{ day: number; dayName: string; isToday: boolean }>;
  today: number;
  checked: Record<number, "complete" | "partial" | "missed">;
  onToggle: (day: number) => void;
  onDelete: () => void;
}) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <>
      <TableRow
        className="border-b hover:bg-gray-50"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <TableCell className="font-semibold min-w-[220px] border-r pr-2">
          <div className="flex justify-between items-center">
            <span>{habit}</span>
            {isHovering && (
              <button
                onClick={onDelete}
                className="p-1 hover:bg-red-50 rounded"
              >
                <X className="w-4 h-4 text-red-600" />
              </button>
            )}
          </div>
        </TableCell>

        {days.map((d) => {
          const isToday = d.day === today;
          const status = checked[d.day] || "missed";
          const isDisabled = !isToday;
          return (
            <TableCell
              key={d.day}
              className={cn("text-center", isToday && "bg-blue-50")}
            >
              <button
                disabled={isDisabled}
                onClick={() => onToggle(d.day)}
                className={cn(
                  "w-8 h-8 rounded-md border-2 flex items-center justify-center transition",
                  isDisabled && "opacity-40 cursor-not-allowed",
                  !isDisabled && "hover:scale-110",
                  status === "complete" &&
                    "bg-emerald-500 border-emerald-600 text-white",
                  status === "partial" &&
                    "bg-orange-400 border-orange-500 text-white",
                  status === "missed" && "bg-red-100 border-red-300 text-red-600",
                  isToday && status === "missed" && "border-blue-400",
                )}
              >
                {status === "complete" && <Check className="w-4 h-4" />}
                {status === "partial" && <CircleDashed className="w-4 h-4" />}
                {status === "missed" && <X className="w-4 h-4" />}
              </button>
            </TableCell>
          );
        })}
      </TableRow>
    </>
  );
}
