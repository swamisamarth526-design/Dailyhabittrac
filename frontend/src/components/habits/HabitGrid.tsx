"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getApiUrl } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import AddHabitDialog from "./AddHabitDialog";
import HabitRow from "./HabitRow";
import { Habit } from "@/types/Habit";
import ConfirmDialog from "../common/ConfirmDialog";
import { useAuth } from "@/context/AuthContext";

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const defaultGuestHabits = ["Drink Water", "Morning Walk", "Read 10 Pages"];
type DayStatus = "missed" | "partial" | "complete";
type TrackingItem = { date: string; status: DayStatus; habitId: string };

const getMonthDaysAndWeeks = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();

  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const allDays: Array<{ day: number; dayName: string; isToday: boolean }> = [];

  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    const dayOfWeek = date.getDay();
    allDays.push({
      day: i,
      dayName: dayNames[dayOfWeek],
      isToday: i === today,
    });
  }

  const weeks: Array<{ label: string; days: typeof allDays }> = [];
  for (let i = 0; i < allDays.length; i += 7) {
    const weekNumber = Math.floor(i / 7) + 1;
    weeks.push({
      label: `Week ${weekNumber}`,
      days: allDays.slice(i, i + 7),
    });
  }

  return { allDays, weeks, today, month, year };
};

export default function HabitGrid() {
  const { allDays, weeks, today, month, year } = getMonthDaysAndWeeks();
  const { isLoggedIn } = useAuth();

  const monthName = new Date(year, month).toLocaleString("default", {
    month: "long",
  });
  const [habits, setHabits] = useState<Habit[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    habit: string | null;
    id: string | null;
  }>({
    open: false,
    habit: null,
    id: null,
  });
  const { toast } = useToast();

  const [checked, setChecked] = useState<
    Record<string, Record<number, DayStatus>>
  >({});
  const isGuestMode = !isLoggedIn;

  const getDefaultHabits = (): Habit[] =>
    defaultGuestHabits.map((name, index) => ({
      _id: `guest-habit-${index + 1}`,
      name,
      status: "pending",
      date: new Date().toISOString(),
    }));

  // const fetchTracking = async (habitId: string) => {
  //   try {
  //     const res = await fetch(
  //       `${process.env.NEXT_PUBLIC_SERVER_URL}api/habits/tracking/${habitId}`,
  //     );
  //     if (!res.ok) throw new Error("Failed to fetch habit tracking");
  //     const data: Array<{
  //       date: string;
  //       status: DayStatus;
  //     }> = await res.json();
  //     const habitChecked: Record<number, DayStatus> = {};
  //     data.forEach((entry) => {
  //       const date = new Date(entry.date);
  //       const day = date.getDate();
  //       habitChecked[day] = entry.status;
  //     });
  //     setChecked((prev) => ({
  //       ...prev,
  //       [habitId]: habitChecked,
  //     }));
  //   } catch (error) {
  //     console.error("Error fetching tracking:", error);
  //   }
  // };

  const fetchTracking = useCallback(async () => {
    try {
      const res = await fetch(getApiUrl(`/api/habits/tracking/month?month=${month}&year=${year}`), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch tracking");

      const data: TrackingItem[] = await res.json();

      const trackingMap: Record<string, Record<number, DayStatus>> = {};

      data.forEach((item) => {
        const dateObj = new Date(item.date);
        const day = dateObj.getDate();
        const habitId = item.habitId;

        if (!trackingMap[habitId]) {
          trackingMap[habitId] = {};
        }

        trackingMap[habitId][day] = item.status;
      });

      setChecked(trackingMap);
    } catch (error) {
      console.error("Tracking fetch error:", error);
    }
  }, [month, year]);

  useEffect(() => {
    const fetchHabits = async () => {
      if (isGuestMode) {
        setHabits(getDefaultHabits());
        setChecked({});
        return;
      }

      try {
        const res = await fetch(getApiUrl("/api/habits"), {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch habits");

        const data = await res.json();
        setHabits(data);
        await fetchTracking();
      } catch (error) {
        console.error("Error fetching habits:", error);
      }
    };
    fetchHabits();
  }, [fetchTracking, isGuestMode]);

  const addHabit = (title: string) => {
    const newHabit: Habit = {
      _id: Math.random().toString(36).substr(2, 9),
      name: title,
      status: "pending",
      date: new Date().toISOString(),
    };
    setHabits((prev) => [...prev, newHabit]);
    toast({
      title: "Habit added",
      description: `"${title}" has been added to your habits${isGuestMode ? " (guest mode)." : "."}`,
    });
  };

  const handleDeleteHabit = (id: string, habit: string) => {
    setDeleteConfirm({
      open: true,
      habit,
      id,
    });
  };
  const confirmDelete = async () => {
    if (deleteConfirm.id === null) return;

    if (isGuestMode) {
      setHabits((prev) =>
        prev.filter((habit) => habit._id !== deleteConfirm.id),
      );
      setChecked((prev) => {
        const updated = { ...prev };
        delete updated[deleteConfirm.id as string];
        return updated;
      });
      toast({
        title: "Habit deleted",
        description: `"${deleteConfirm.habit}" has been removed.`,
      });
      setDeleteConfirm({ open: false, habit: null, id: null });
      return;
    }

    try {
      const res = await fetch(getApiUrl(`/api/habits/${deleteConfirm.id}`), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete habit");

      setHabits((prev) =>
        prev.filter((habit) => habit._id !== deleteConfirm.id),
      );

      toast({
        title: "Habit deleted",
        description: `"${deleteConfirm.habit}" has been removed.`,
      });
    } catch (error) {
      console.error("Delete error:", error);

      toast({
        title: "Error",
        description: "Failed to delete habit",
        variant: "destructive",
      });
    }

    setDeleteConfirm({ open: false, habit: null, id: null });
  };

  const toggleDay = async (habitId: string, day: number) => {
    const currentStatus = checked[habitId]?.[day] || "missed";

    let nextStatus: DayStatus;

    if (currentStatus === "missed") nextStatus = "partial";
    else if (currentStatus === "partial") nextStatus = "complete";
    else nextStatus = "missed";

    if (isGuestMode) {
      setChecked((prev) => ({
        ...prev,
        [habitId]: {
          ...prev[habitId],
          [day]: nextStatus,
        },
      }));
      return;
    }

    try {
      const selectedDate = new Date(year, month, day);

      const res = await fetch(getApiUrl("/api/habits/tracking"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          habitId,
          date: selectedDate.toISOString(),
          status: nextStatus,
        }),
      });

      if (!res.ok) throw new Error("Failed to update habit tracking");

      setChecked((prev) => ({
        ...prev,
        [habitId]: {
          ...prev[habitId],
          [day]: nextStatus,
        },
      }));
    } catch (error) {
      console.error("Toggle error:", error);
      toast({
        title: "Error",
        description: "Failed to update habit",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card className="p-6 md:p-8 shadow-md border-gray-200 bg-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {monthName} {year}
            </h1>
            <p className="text-sm md:text-base text-gray-600 mt-2">
              Today is {monthName} {today} • {habits.length} active habit
              {habits.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="mr-20">
            <AddHabitDialog onAdd={addHabit} isGuestMode={isGuestMode} />
          </div>
        </div>

        <div className="">
          <Table>
            <TableHeader>
              <TableRow className="border-b-2 border-gray-300 hover:bg-transparent">
                <TableHead
                  rowSpan={3}
                  className="min-w-[220px] text-lg font-bold text-gray-900"
                >
                  My Habits
                </TableHead>
                {weeks.map((w) => (
                  <TableHead
                    key={w.label}
                    colSpan={w.days.length}
                    className="text-center text-sm font-semibold text-gray-700"
                  >
                    {w.label}
                  </TableHead>
                ))}
              </TableRow>

              <TableRow className="border-b border-gray-300 hover:bg-transparent">
                {allDays.map((dayObj) => (
                  <TableHead
                    key={`day-${dayObj.day}`}
                    className={`text-center min-w-[40px] text-xs font-medium ${dayObj.isToday
                        ? "text-blue-600 font-bold"
                        : "text-gray-600"
                      }`}
                  >
                    {dayObj.day}
                  </TableHead>
                ))}
              </TableRow>

              <TableRow className="border-b-2 border-gray-300 hover:bg-transparent">
                {allDays.map((dayObj) => (
                  <TableHead
                    key={`dayname-${dayObj.day}`}
                    className={`text-center min-w-[40px] text-xs font-semibold ${dayObj.isToday
                        ? "text-blue-600 font-bold bg-blue-50"
                        : "text-gray-500"
                      }`}
                  >
                    {dayObj.dayName}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {habits.map((h) => (
                <HabitRow
                  key={h._id}
                  habit={h.name}
                  days={allDays}
                  today={today}
                  checked={checked[h._id] || {}}
                  onToggle={(day) => toggleDay(h._id, day)}
                  onDelete={() => handleDeleteHabit(h._id, h.name)}
                />
              ))}
            </TableBody>
          </Table>
        </div>

        {habits.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No habits yet. Add one to get started!
            </p>
          </div>
        )}
      </Card>

      <ConfirmDialog
        open={deleteConfirm.open}
        setOpen={(open) =>
          !open && setDeleteConfirm({ open: false, habit: null, id: null })
        }
        title="Delete habit?"
        description={`Are you sure you want to delete "${deleteConfirm.habit}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </>
  );
}
