"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { getApiUrl } from "@/lib/api";
import AddSleepCard from "./AddSleepCard";
import SleepStats from "./SleepStats";
import SleepChart from "./SleepChart";

export interface SleepData {
  date: number;
  day: string;
  hours: number;
}

export default function SleepPage() {
  const [sleepData, setSleepData] = useState<SleepData[]>([]);
  const [sleepHours, setSleepHours] = useState<string>("");

  const { toast } = useToast();

  const today = new Date();
  const todayDate = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const monthName = today.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();

    const data: SleepData[] = [];

    for (let i = 1; i <= daysInMonth; i++) {
      const dayIndex = (firstDay + i - 1) % 7;
      data.push({
        date: i,
        day: days[dayIndex],
        hours: 0,
      });
    }

    setSleepData(data);
  }, []);

  useEffect(() => {
    const fetchSleepData = async () => {
      try {
        const res = await fetch(getApiUrl("/api/sleepTrackers"), {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch sleep data");

        const Data = await res.json();

        setSleepData((prev) =>
          prev.map((dayItem) => {
            const match = Data.find((entry: any) => {
              const d = new Date(entry.sleepdate);
              return (
                d.getUTCDate() === dayItem.date &&
                d.getUTCMonth() === currentMonth &&
                d.getUTCFullYear() === currentYear
              );
            });

            if (!match) return dayItem;

            const d = new Date(match.sleepdate);

            return {
              ...dayItem,
              hours: Number(match.hoursSlept),
              day: days[d.getUTCDay()],
            };
          }),
        );
      } catch (error) {
        console.error("Error fetching sleep data:", error);
      }
    };

    if (sleepData.length > 0) {
      fetchSleepData();
    }
  }, [sleepData.length]);

  const handleAddSleep = () => {
    if (!sleepHours) {
      toast({
        title: "Error",
        description: "Please enter sleep hours",
        variant: "destructive",
      });
      return;
    }

    const hours = Number.parseFloat(sleepHours);

    if (hours < 0 || hours > 24 || Number.isNaN(hours)) {
      toast({
        title: "Invalid Input",
        description: "Sleep hours must be between 0 and 24",
        variant: "destructive",
      });
      return;
    }

    setSleepData((prev) =>
      prev.map((item) => (item.date === todayDate ? { ...item, hours } : item)),
    );

    toast({
      title: "Sleep Logged",
      description: `${hours} hours logged for today`,
    });

    setSleepHours("");
  };

  const averageSleep =
    sleepData.length > 0
      ? (
        sleepData.reduce((sum, item) => sum + item.hours, 0) /
        sleepData.length
      ).toFixed(1)
      : "0";

  const daysTracked = sleepData.filter((d) => d.hours > 0).length;

  const todaySleep = sleepData.find((d) => d.date === todayDate)?.hours || 0;

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sleep Tracker</h2>
          <p className="text-sm text-gray-600 mt-1">{monthName}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Today's Sleep</p>
          <p className="text-2xl font-bold text-blue-600">{todaySleep}h</p>
        </div>
      </div>

      <AddSleepCard
        sleepHours={sleepHours}
        setSleepHours={setSleepHours}
        onAdd={handleAddSleep}
        today={todayDate}
      />

      <SleepStats average={averageSleep} daysTracked={daysTracked} />

      <SleepChart data={sleepData} />
    </div>
  );
}
