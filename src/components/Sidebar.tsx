"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PhoneCall, Settings, ShieldAlert, Voicemail } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Call Logs", href: "/logs", icon: PhoneCall },
    { name: "Voicemail", href: "/voicemail", icon: Voicemail },
    { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="hidden md:flex h-screen w-64 flex-col glass border-r-0">
            <div className="flex h-16 items-center px-6 border-b border-white/10">
                <ShieldAlert className="h-6 w-6 text-primary mr-2" />
                <span className="text-lg font-bold text-foreground tracking-wide">AI Security</span>
            </div>
            <nav className="flex-1 space-y-1 px-2 py-4">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                isActive
                                    ? "bg-primary/10 text-primary border-l-2 border-primary"
                                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                                "group flex items-center px-4 py-3 text-sm font-medium rounded-r-md transition-all duration-200 ease-in-out"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                                    "mr-3 h-5 w-5 flex-shrink-0 transition-colors"
                                )}
                            />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
            <div className="p-4 border-t border-white/10 bg-slate-900/50">
                <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold border border-primary/20">
                        U
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-foreground">User</p>
                        <p className="text-xs text-emerald-500 flex items-center gap-1">
                            <span className="block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Protected
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
