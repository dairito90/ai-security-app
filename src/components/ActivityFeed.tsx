import { Phone, PhoneOff, ShieldCheck, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { CallEvent } from "@/lib/simulation";

interface ActivityFeedProps {
    items: CallEvent[];
}

export function ActivityFeed({ items }: ActivityFeedProps) {
    return (
        <div className="rounded-xl glass-card h-[400px] flex flex-col overflow-hidden">
            <div className="p-6 border-b border-white/10 bg-white/5">
                <h3 className="text-lg font-medium text-foreground tracking-wide">Recent Activity</h3>
            </div>
            <div className="divide-y divide-white/10 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {items.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground flex flex-col items-center justify-center h-full">
                        <div className="h-2 w-2 bg-primary rounded-full animate-ping mb-4" />
                        Waiting for calls...
                    </div>
                ) : (
                    items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors animate-in slide-in-from-top-2 duration-300 group">
                            <div className="flex items-center space-x-4">
                                <div className={cn(
                                    "p-2 rounded-lg transition-colors",
                                    item.status === "blocked" ? "bg-red-500/10 text-red-400 group-hover:bg-red-500/20" :
                                        item.status === "screened" ? "bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20" :
                                            "bg-green-500/10 text-green-400 group-hover:bg-green-500/20"
                                )}>
                                    {item.status === "blocked" ? <ShieldAlert className="h-5 w-5" /> :
                                        item.status === "screened" ? <PhoneOff className="h-5 w-5" /> :
                                            <ShieldCheck className="h-5 w-5" />}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{item.caller}</p>
                                    <p className="text-xs text-muted-foreground">{item.details}</p>
                                </div>
                            </div>
                            <span className="text-xs text-muted-foreground font-mono">{item.timestamp}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
