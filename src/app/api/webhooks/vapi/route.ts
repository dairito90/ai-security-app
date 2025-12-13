import { NextResponse } from "next/server";
import { CallEvent } from "@/lib/simulation";

// In-memory store for MVP (Replace with DB in production)
export let realCalls: CallEvent[] = [];

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Vapi sends various events, we care about 'call.ended' or 'function-call'
        // For this MVP, we'll process 'call.ended' to get the full summary
        if (body.message?.type === "end-of-call-report" || body.type === "end-of-call-report") {
            const report = body.message || body;

            // Determine status based on Vapi analysis
            // If successEvaluation is true, it means the goal was met (e.g. took a message)
            const isProductive = report.analysis?.successEvaluation === "true";
            const status = isProductive ? "allowed" : "screened";

            const newCall: CallEvent = {
                id: report.call.id,
                caller: "Real Caller",
                number: report.customer?.number || "Unknown",
                timestamp: new Date().toLocaleTimeString(),
                status: status,
                riskScore: isProductive ? 0 : 80,
                details: isProductive ? "Voicemail Left" : "Call processed by AI Agent",
                transcript: report.transcript || "No transcript available",
            };

            // If productive, save to Voicemail Store
            if (isProductive) {
                const voicemailData = {
                    ...newCall,
                    isRead: false,
                    duration: report.durationSeconds ? `${Math.floor(report.durationSeconds / 60)}:${(report.durationSeconds % 60).toString().padStart(2, '0')}` : "0:00",
                    summary: report.summary || report.analysis?.summary || "No summary available"
                };

                // Dynamic import to avoid build issues with fs in edge runtime if applicable (though this is node)
                const { saveVoicemail } = await import("@/lib/store");
                saveVoicemail(voicemailData);
                console.log("Saved Voicemail:", voicemailData);
            }

            realCalls.unshift(newCall);
            // Keep only last 50
            if (realCalls.length > 50) realCalls = realCalls.slice(0, 50);

            console.log("Received Vapi Call:", newCall);
        }

        return NextResponse.json({ status: "ok" });
    } catch (error) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ status: "error" }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json(realCalls);
}
