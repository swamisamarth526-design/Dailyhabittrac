
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { on } from "events";
import { getApiUrl } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

export default function AddSleepCard({
  sleepHours,
  setSleepHours,
  onAdd,
  today,
}: {
  sleepHours: string;
  setSleepHours: (v: string) => void;
  onAdd: () => void;
  today: number;
}) {
  const hours = parseFloat(sleepHours);
  const isValid = sleepHours === "" || (hours >= 0 && hours <= 16);
  const [sleep, setSleep] = useState("");

  const postSleepData = async () => {
    if (!sleepHours || !isValid) return;
    try {
      const res = await fetch(getApiUrl("/api/sleepTrackers"), {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          hoursSlept: parseFloat(sleepHours),
          sleepdate: new Date().toISOString(),
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
      onAdd();
      console.log("Sleep entry added successfully");
    } catch (error) {
      console.error("Error adding sleep entry:", error);
    }
  };

  return (
    <Card className="border border-gray-200 bg-white">
      <CardHeader>
        <CardTitle className="text-lg">Log Sleep Hours</CardTitle>
        <CardDescription>Add sleep hours for today</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Hours Slept
            </label>
            <Input
              type="number"
              min="0"
              max="16"
              step="0.5"
              value={sleepHours}
              onChange={(e) => setSleepHours(e.target.value)}
              placeholder="Enter hours (e.g., 7.5)"
              className={!isValid ? "border-red-500" : ""}
            />
            {!isValid && (
              <p className="text-xs text-red-500 mt-1">
                Sleep hours must be between 0 and 16
              </p>
            )}
          </div>
          <Button
            onClick={postSleepData}
            disabled={!isValid || sleepHours === ""}
            className="gap-2 bg-gray-900 hover:bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Add
          </Button>
        </div>
        <p className="text-xs text-gray-500">
          You can only log sleep hours for today ({today})
        </p>
      </CardContent>
    </Card>
  );
}
