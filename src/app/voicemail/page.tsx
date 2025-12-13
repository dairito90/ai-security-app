"use client";

import { useState, useEffect } from "react";
import { Play, Pause, Trash2, PhoneIncoming, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface Voicemail {
    id: string;
    caller: string;
    number: string;
    timestamp: string;
    duration: string;
    transcript: string;
    summary: string;
    isRead: boolean;
}

const mockVoicemails: Voicemail[] = [
    {
        id: "1",
        caller: "Mom",
        number: "+1 (555) 111-2222",
        timestamp: "Today, 10:30 AM",
        duration: "0:45",
        transcript: "Hey, just calling to see if you're coming for dinner on Sunday. Let me know!",
        summary: "Dinner invitation for Sunday.",
        isRead: false
    },
    {
        id: "2",
        caller: "Dr. Smith",
        number: "+1 (555) 333-4444",
        timestamp: "Yesterday, 2:15 PM",
        duration: "1:12",
        transcript: "This is Dr. Smith's office confirming your appointment for next Tuesday at 10am. Please call back if you need to reschedule.",
        summary: "Appointment confirmation (Tue 10am).",
        isRead: true
    },
];

export default function VoicemailPage() {
    const [playingId, setPlayingId] = useState<string | null>(null);
    const [voicemails, setVoicemails] = useState<Voicemail[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch voicemails on mount
    useEffect(() => {
        fetch("/api/voicemail")
            .then(res => res.json())
            .then(data => {
                setVoicemails(data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Failed to load voicemails", err);
                setIsLoading(false);
            });
    }, []);

    const togglePlay = (id: string) => {
        if (playingId === id) {
            setPlayingId(null);
        } else {
            setPlayingId(id);
            // In a real app, we would play the audio URL here
            // const audio = new Audio(voicemails.find(v => v.id === id)?.recordingUrl);
            // audio.play();
            setTimeout(() => setPlayingId(null), 3000);
        }
    };

    const deleteVoicemail = async (id: string) => {
        // Optimistic update
        setVoicemails(voicemails.filter(v => v.id !== id));

        try {
            await fetch(`/api/voicemail?id=${id}`, { method: "DELETE" });
        } catch (error) {
            console.error("Failed to delete voicemail", error);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Voicemail</h1>
                <p className="text-muted-foreground">Smart inbox for legitimate messages</p>
            </div>

            <div className="grid gap-4">
                {voicemails.length === 0 ? (
                    <div className="text-center p-12 border border-dashed border-border rounded-xl text-muted-foreground">
                        No messages
                    </div>
                ) : (
                    voicemails.map((vm) => (
                        <div
                            key={vm.id}
                            className={cn(
                                "group relative flex flex-col sm:flex-row gap-4 p-6 rounded-xl border transition-all",
                                vm.isRead ? "bg-card border-border" : "bg-primary/5 border-primary/20"
                            )}
                        >
                            <div className="flex items-start justify-between sm:w-64 flex-shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-muted text-foreground">
                                        <User className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className={cn("font-medium", !vm.isRead && "text-primary")}>{vm.caller}</h3>
                                        <p className="text-xs text-muted-foreground">{vm.number}</p>
                                    </div>
                                </div>
                                <span className="text-xs text-muted-foreground sm:hidden">{vm.timestamp}</span>
                            </div>

                            <div className="flex-1 min-w-0 space-y-2">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-foreground">{vm.summary}</p>
                                    <span className="text-xs text-muted-foreground hidden sm:inline-block">{vm.timestamp}</span>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2 group-hover:line-clamp-none transition-all">
                                    "{vm.transcript}"
                                </p>

                                <div className="flex items-center gap-4 pt-2">
                                    <button
                                        onClick={() => togglePlay(vm.id)}
                                        className="flex items-center gap-2 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                                    >
                                        {playingId === vm.id ? (
                                            <>
                                                <Pause className="h-4 w-4" /> Pause
                                            </>
                                        ) : (
                                            <>
                                                <Play className="h-4 w-4" /> Play ({vm.duration})
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => deleteVoicemail(vm.id)}
                                        className="text-xs font-medium text-muted-foreground hover:text-red-500 transition-colors flex items-center gap-1"
                                    >
                                        <Trash2 className="h-3 w-3" /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
