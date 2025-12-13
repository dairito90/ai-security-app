"use client";

import { useEffect, useState } from "react";
import { Shield, Clock, PhoneOff, Activity } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { ActivityFeed } from "@/components/ActivityFeed";
import { generateMockCall, CallEvent } from "@/lib/simulation";
import { cn } from "@/lib/utils";

export default function Home() {
  const [activity, setActivity] = useState<CallEvent[]>([]);
  const [stats, setStats] = useState({
    blocked: 1284,
    wasted: 42.25, // hours
    active: 0,
    autoAnswered: 842,
  });

  const [isRealMode, setIsRealMode] = useState(false);
  const [sensitivity, setSensitivity] = useState(50);

  // Load sensitivity on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ai_security_sensitivity");
      if (saved) setSensitivity(Number(saved));
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRealMode) {
      // Poll for real data
      interval = setInterval(async () => {
        try {
          const res = await fetch("/api/webhooks/vapi");
          const realCalls = await res.json();
          if (Array.isArray(realCalls) && realCalls.length > 0) {
            setActivity(realCalls);
            // Simple stats aggregation for demo
            setStats(prev => ({
              ...prev,
              active: 1, // Assume active if we have calls
              autoAnswered: realCalls.length
            }));
          }
        } catch (e) {
          console.error("Failed to fetch real calls", e);
        }
      }, 3000);
    } else {
      // Simulation Mode
      interval = setInterval(() => {
        // Read sensitivity from localStorage directly to get latest value without re-rendering
        const currentSensitivity = typeof window !== "undefined"
          ? Number(localStorage.getItem("ai_security_sensitivity") || 50)
          : 50;

        const newCall = generateMockCall(currentSensitivity);
        setActivity((prev) => [newCall, ...prev].slice(0, 10));
        setStats((prev) => ({
          blocked: newCall.status === "blocked" ? prev.blocked + 1 : prev.blocked,
          wasted: newCall.status === "screened" ? prev.wasted + 0.05 : prev.wasted,
          active: newCall.status === "screened" ? prev.active + 1 : Math.max(0, prev.active - 1),
          autoAnswered: newCall.status === "screened" ? prev.autoAnswered + 1 : prev.autoAnswered,
        }));
      }, 3000);
    }

    return () => clearInterval(interval);
  }, [isRealMode]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Real-time protection overview</p>
        </div>
        <div className="flex items-center gap-3 bg-card border border-border p-1 rounded-lg">
          <button
            onClick={() => setIsRealMode(false)}
            className={cn("px-3 py-1.5 text-sm font-medium rounded-md transition-colors", !isRealMode ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
          >
            Simulation
          </button>
          <button
            onClick={() => setIsRealMode(true)}
            className={cn("px-3 py-1.5 text-sm font-medium rounded-md transition-colors", isRealMode ? "bg-green-600 text-white" : "text-muted-foreground hover:text-foreground")}
          >
            Real Mode
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Calls Blocked"
          value={stats.blocked.toLocaleString()}
          change="+12% from last week"
          trend="up"
          icon={Shield}
        />
        <StatsCard
          title="Time Wasted"
          value={`${Math.floor(stats.wasted)}h ${Math.round((stats.wasted % 1) * 60)}m`}
          change="+2.5h today"
          trend="up"
          icon={Clock}
        />
        <StatsCard
          title="Active Threats"
          value={stats.active.toString()}
          change={stats.active > 2 ? "High Activity" : "Low Risk"}
          trend={stats.active > 2 ? "up" : "down"}
          icon={Activity}
        />
        <StatsCard
          title="Auto-Answered"
          value={stats.autoAnswered.toLocaleString()}
          change="+8% efficiency"
          trend="up"
          icon={PhoneOff}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ActivityFeed items={activity} />
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col">
          <h3 className="text-lg font-medium text-foreground mb-4">Live Threat Map</h3>
          <div className="flex-1 flex items-center justify-center rounded-lg bg-muted/20 border border-dashed border-muted-foreground/25 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <div className="w-64 h-64 bg-primary rounded-full blur-3xl animate-pulse" />
            </div>
            <p className="text-muted-foreground relative z-10">Global Threat Monitoring Active</p>
          </div>
        </div>
      </div>
    </div>
  );
}
