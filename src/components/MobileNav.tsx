"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PhoneCall, Settings, Voicemail } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Logs", href: "/logs", icon: PhoneCall },
    { name: "Voicemail", href: "/voicemail", icon: Voicemail },
    { name: "Settings", href: "/settings", icon: Settings },
];

export function MobileNav() {
    const pathname = usePathname();

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-white/10 glass px-4 md:hidden">
            {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                            "flex flex-col items-center justify-center space-y-1 transition-all duration-200",
                            isActive ? "text-primary scale-105" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <item.icon className="h-6 w-6" />
                        <span className="text-[10px] font-medium">{item.name}</span>
                    </Link>
                );
            })}
        </div>
    );
}
