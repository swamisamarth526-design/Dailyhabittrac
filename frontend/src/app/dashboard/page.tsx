import HabitGrid from "@/components/habits/HabitGrid";
import SleepPage from "@/components/sleep-tracker/page";


export default function DashboardPage() {
  return (
     <main className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <HabitGrid />
        <div className=" py-20">
        <SleepPage/>
        </div>
      </div>
    </main>
  );
}
