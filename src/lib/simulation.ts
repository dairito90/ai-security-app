export interface CallEvent {
    id: string;
    caller: string;
    number: string;
    timestamp: string;
    status: "blocked" | "screened" | "allowed";
    riskScore: number;
    details?: string;
    transcript?: string;
}

const CALLERS = [
    { name: "Potential Spam", type: "spam" },
    { name: "Unknown", type: "unknown" },
    { name: "Telemarketer", type: "spam" },
    { name: "IRS Scam", type: "spam" },
    { name: "Mom", type: "contact" },
    { name: "Amazon Delivery", type: "contact" },
    { name: "Bank Fraud Dept", type: "spam" }, // Tricky one
];

const TRANSCRIPTS = [
    "Agent: Hello? Who is this?\nScammer: This is Amazon support.\nAgent: Oh! I love the Amazon. Do you have the monkeys?\nScammer: What? No, your account...\nAgent: I want a monkey.",
    "Agent: Hello?\nScammer: You have a virus on your computer.\nAgent: Oh no! Is it contagious? I just sneezed on the keyboard.\nScammer: No sir, it's digital.\nAgent: I better put a mask on it.",
    "Agent: Yes?\nScammer: We are calling about your car warranty.\nAgent: My horse has a warranty?\nScammer: Your car, sir.\nAgent: I only ride horses. His name is Buttercup.",
];

export function generateMockCall(sensitivity: number = 50): CallEvent {
    const callerTemplate = CALLERS[Math.floor(Math.random() * CALLERS.length)];
    const isSpam = callerTemplate.type === "spam";
    const isContact = callerTemplate.type === "contact";

    let status: "blocked" | "screened" | "allowed" = "allowed";
    let riskScore = 0;

    if (isSpam) {
        riskScore = Math.floor(Math.random() * 40) + 60; // 60-99
        // Calculate blocking threshold based on sensitivity
        // Sensitivity 0 (Permissive) -> Threshold 95 (Only block very high risk)
        // Sensitivity 50 (Balanced) -> Threshold 80
        // Sensitivity 100 (Aggressive) -> Threshold 65 (Block almost all spam)
        const threshold = 95 - (sensitivity * 0.3);
        status = riskScore > threshold ? "blocked" : "screened";
    } else if (!isContact) {
        riskScore = Math.floor(Math.random() * 50); // 0-49
        // If sensitivity is very high (>80), we might screen unknown numbers more aggressively
        status = sensitivity > 80 ? "screened" : "allowed";
    }

    return {
        id: Math.random().toString(36).substring(7),
        caller: callerTemplate.name,
        number: `+1 (${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        timestamp: "Just now",
        status,
        riskScore,
        details: isSpam ? "High Risk Detected" : isContact ? "Contact" : "Screening...",
        transcript: status === "screened" && isSpam ? TRANSCRIPTS[Math.floor(Math.random() * TRANSCRIPTS.length)] : undefined,
    };
}
