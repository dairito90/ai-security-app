"use client";

import { useState } from "react";
import { User, Shield, Bell, Volume2, Save } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
    const [persona, setPersona] = useState("grandpa");
    const [sensitivity, setSensitivity] = useState(75); // Default increased to 75%
    const [blockUnknown, setBlockUnknown] = useState(true);
    const [greetingType, setGreetingType] = useState("standard");
    const [customGreeting, setCustomGreeting] = useState("Hi, I'm not available right now. Please leave a message.");

    // Load settings on mount
    useState(() => {
        if (typeof window !== "undefined") {
            const savedSensitivity = localStorage.getItem("ai_security_sensitivity");
            if (savedSensitivity) setSensitivity(Number(savedSensitivity));
        }
    });

    const handleSave = () => {
        if (typeof window !== "undefined") {
            localStorage.setItem("ai_security_sensitivity", sensitivity.toString());
            alert("Settings saved!");
        }
    };

    return (
        <div className="space-y-8 max-w-4xl">
            {/* ... (Header) ... */}
            <div>
                <h1 className="text-3xl font-bold text-foreground">Settings</h1>
                <p className="text-muted-foreground">Configure your AI agent and protection preferences</p>
            </div>

            {/* AI Persona Section */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <User className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-lg font-medium text-foreground">AI Persona</h2>
                        <p className="text-sm text-muted-foreground">Choose who answers your spam calls</p>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    {[
                        { id: "grandpa", name: "Confused Grandpa", desc: "Wastes time with endless stories and confusion.", icon: "👴" },
                        { id: "executive", name: "Busy Executive", desc: "Demands quick answers and schedules fake meetings.", icon: "👔" },
                        { id: "karen", name: "Angry Customer", desc: "Complains about everything and demands a manager.", icon: "😤" },
                    ].map((p) => (
                        <button
                            key={p.id}
                            onClick={() => setPersona(p.id)}
                            className={cn(
                                "relative flex flex-col items-start p-4 rounded-lg border transition-all text-left",
                                persona === p.id
                                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                            )}
                        >
                            <span className="text-2xl mb-2">{p.icon}</span>
                            <span className="font-medium text-foreground">{p.name}</span>
                            <span className="text-xs text-muted-foreground mt-1">{p.desc}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Blocking Rules Section */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
                        <Shield className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-lg font-medium text-foreground">Protection Level</h2>
                        <p className="text-sm text-muted-foreground">Adjust how aggressive the blocking should be</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium text-foreground">Spam Detection Sensitivity</label>
                            <span className="text-sm text-muted-foreground">{sensitivity}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={sensitivity}
                            onChange={(e) => setSensitivity(Number(e.target.value))}
                            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                            <span>Permissive</span>
                            <span>Balanced</span>
                            <span>Aggressive</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between py-4 border-t border-border">
                        <div>
                            <p className="font-medium text-foreground">Block Unknown Numbers</p>
                            <p className="text-sm text-muted-foreground">Automatically screen calls from non-contacts</p>
                        </div>
                        <button
                            onClick={() => setBlockUnknown(!blockUnknown)}
                            className={cn(
                                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                                blockUnknown ? "bg-primary" : "bg-muted"
                            )}
                        >
                            <span
                                className={cn(
                                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                                    blockUnknown ? "translate-x-6" : "translate-x-1"
                                )}
                            />
                        </button>
                    </div>
                </div>
            </div>

            {/* Voicemail Greeting Section */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                        <Volume2 className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-lg font-medium text-foreground">Voicemail Greeting</h2>
                        <p className="text-sm text-muted-foreground">Customize what callers hear when they leave a message</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-3">
                        {[
                            { id: "standard", name: "Standard", text: "The person you are calling is busy. Please leave a message." },
                            { id: "professional", name: "Professional", text: "You have reached the office. Please leave your name and number." },
                            { id: "custom", name: "Custom", text: "" },
                        ].map((g) => (
                            <button
                                key={g.id}
                                onClick={() => setGreetingType(g.id)}
                                className={cn(
                                    "flex flex-col items-start p-4 rounded-lg border transition-all text-left",
                                    greetingType === g.id
                                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                                )}
                            >
                                <span className="font-medium text-foreground">{g.name}</span>
                                {g.id !== "custom" && <span className="text-xs text-muted-foreground mt-1 line-clamp-2">{g.text}</span>}
                            </button>
                        ))}
                    </div>

                    {greetingType === "custom" && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Custom Script</label>
                            <textarea
                                value={customGreeting}
                                onChange={(e) => setCustomGreeting(e.target.value)}
                                className="w-full min-h-[100px] p-3 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                                placeholder="Type your custom greeting here..."
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                    <Save className="h-4 w-4" />
                    Save Changes
                </button>
            </div>
        </div>
    );
}
