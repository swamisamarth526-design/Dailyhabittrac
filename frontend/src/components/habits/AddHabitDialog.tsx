"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { getApiUrl } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

export default function AddHabitDialog({
  onAdd,
  isGuestMode = false,
}: {
  onAdd: (title: string) => void;
  isGuestMode?: boolean;
}) {
  const [title, setTitle] = useState("");

  const postHabits = async () => {
    if (!title.trim()) return;
    if (isGuestMode) {
      onAdd(title.trim());
      setTitle("");
      return;
    }
    try {
      const res = await fetch(getApiUrl("/api/habits"), {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name: title,
          status: "pending",
          date: new Date().toISOString(),
        }),
      });

      if (res.status == 401) {
        toast({
          title: "Login required",
          description: "Please login first to continue.",
          variant: "destructive",
        });
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/account/login";

        throw new Error("Unauthorized");
      }
      onAdd(title);
      setTitle("");
    } catch (error) {
      console.error("Error adding habit:", error);
    }
  };

  return (
    <div className="flex gap-2 w-full md:w-auto">
      <Input
        placeholder="New habit..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && postHabits()}
        className="flex-1 md:flex-none min-w-[180px] border-gray-300 bg-white text-gray-900 placeholder-gray-400"
      />
      <Button
        onClick={postHabits}
        className="gap-2 bg-gray-900 hover:bg-gray-800 text-white"
      >
        <Plus className="w-4 h-4" />
        Add
      </Button>
    </div>
  );
}
