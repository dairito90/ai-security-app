"use client";

import { useState } from "react";
import { Play, Pause, ShieldAlert, ShieldCheck, PhoneOff, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface CallLog {
    id: string;
    caller: string;
    number: string;
    timestamp: string;
    duration: string;
    status: "blocked" | "screened" | "allowed";
    riskScore: number;
    transcript?: string;
}

const mockLogs: CallLog[] = [
    { id: "1", caller: "Potential Spam", number: "+1 (555) 012-3456", timestamp: "Today, 10:23 AM", duration: "0:00", status: "blocked", riskScore: 98 },
    { id: "2", caller: "Unknown", number: "+1 (555) 987-6543", timestamp: "Today, 09:15 AM", duration: "2:14", status: "screened", riskScore: 75, transcript: "Agent: Hello? Who is this?\nScammer: I am calling from your bank...\nAgent: Oh, which bank? I have money under my mattress." },
    { id: "3", caller: "Mom", number: "+1 (555) 111-2222", timestamp: "Yesterday, 8:45 PM", duration: "5:32", status: "allowed", riskScore: 0 },
    { id: "4", caller: "Telemarketer", number: "+1 (800) 555-9999", timestamp: "Yesterday, 2:30 PM", duration: "0:00", status: "blocked", riskScore: 85 },
    { id: "5", caller: "Unknown", number: "+1 (555) 444-3333", timestamp: "Yesterday, 1:00 PM", duration: "1:05", status: "screened", riskScore: 60, transcript: "Agent: Hello?\nCaller: Is this the homeowner?\nAgent: No, this is the cat." },
];

export default function LogsPage() {
    const [playingId, setPlayingId] = useState<string | null>(null);

    const togglePlay = (id: string) => {
        if (playingId === id) {
            setPlayingId(null);
        } else {
            setPlayingId(id);
            // Simulate playback
            setTimeout(() => setPlayingId(null), 3000);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Call Logs</h1>
                <p className="text-muted-foreground">History of screened and blocked calls</p>
            </div>

            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted/50 text-muted-foreground">
                            <tr>
                                <th className="px-6 py-4 font-medium">Caller</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Risk Score</th>
                                <th className="px-6 py-4 font-medium">Duration</th>
                                <th className="px-6 py-4 font-medium">Time</th>
                                <th className="px-6 py-4 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {mockLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-muted/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-medium text-foreground">{log.caller}</p>
                                            <p className="text-xs text-muted-foreground">{log.number}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                                            log.status === "blocked" ? "bg-red-500/10 text-red-500" :
                                                log.status === "screened" ? "bg-blue-500/10 text-blue-500" :
                                                    "bg-green-500/10 text-green-500"
                                        )}>
                                            {log.status === "blocked" ? "Blocked" :
                                                log.status === "screened" ? "Screened" :
                                                    "Allowed"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-16 rounded-full bg-muted overflow-hidden">
                                                <div
                                                    className={cn("h-full rounded-full",
                                                        log.riskScore > 80 ? "bg-red-500" :
                                                            log.riskScore > 50 ? "bg-yellow-500" : "bg-green-500"
                                                    )}
                                                    style={{ width: `${log.riskScore}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-muted-foreground">{log.riskScore}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">{log.duration}</td>
                                    <td className="px-6 py-4 text-muted-foreground">{log.timestamp}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {log.status === "screened" && (
                                                <button
                                                    onClick={() => togglePlay(log.id)}
                                                    className="p-2 rounded-full hover:bg-primary/10 text-primary transition-colors"
                                                    title="Play Recording"
                                                >
                                                    {playingId === log.id ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                                </button>
                                            )}
                                            <button className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
