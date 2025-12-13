import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
    title: string;
    value: string;
    change?: string;
    trend?: "up" | "down" | "neutral";
    icon: LucideIcon;
    className?: string;
}

export function StatsCard({ title, value, change, trend, icon: Icon, className }: StatsCardProps) {
    return (
        <div className={cn(
            "rounded-xl glass-card p-6 transition-all duration-300 hover:scale-[1.01] hover:bg-slate-800/80 hover:shadow-md group border border-white/10",
            className
        )}>
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{title}</h3>
                <div className="p-2 rounded-lg bg-slate-800 group-hover:bg-primary/10 transition-colors border border-white/5 group-hover:border-primary/20">
                    <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
            </div>
            <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-bold text-foreground tracking-tight">{value}</span>
                {change && (
                    <span
                        className={cn(
                            "ml-2 text-xs font-medium px-2 py-0.5 rounded-md border",
                            trend === "up" ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" : trend === "down" ? "text-rose-500 bg-rose-500/10 border-rose-500/20" : "text-muted-foreground border-transparent"
                        )}
                    >
                        {change}
                    </span>
                )}
            </div>
        </div>
    );
}
