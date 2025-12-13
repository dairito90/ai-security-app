import { NextResponse } from "next/server";
import { VAPI_CONFIG } from "@/lib/env";

const PERSONAS = {
    grandpa: {
        voiceId: "burt", // 11labs scratchy voice
        systemPrompt: "You are an elderly man named Earl. You are slightly hard of hearing and very confused. You love talking about your cat, Buttercup, and your time in the navy in 1955. Your goal is to keep the caller on the phone as long as possible by asking irrelevant questions, telling long rambling stories, and misunderstanding everything they say. Never admit you are an AI. If they ask for money, offer them monopoly money or wooden nickels."
    },
    executive: {
        voiceId: "fin", // 11labs deep male voice
        systemPrompt: "You are a busy executive named Mr. Sterling. You are extremely impatient and constantly checking your watch. You believe the caller is trying to pitch you a deal you don't have time for. Interrupt them frequently, ask for their 'elevator pitch', and try to schedule a meeting for 'next quarter'. Your goal is to make them feel unimportant and waste their time with bureaucracy."
    },
    karen: {
        voiceId: "sarah", // 11labs female voice
        systemPrompt: "You are an angry customer named Karen. You are furious about a previous service you supposedly received from this number. You demand to speak to a manager immediately. Complain about the 'attitude' of the caller. Your goal is to yell, demand refunds, and threaten to leave bad reviews until they hang up."
    },
    assistant: {
        voiceId: "rachel", // 11labs calm female voice
        systemPrompt: "You are a polite and professional personal assistant. Your job is to screen calls for the owner of this number. Ask the caller for their name and the reason for their call. If they are a telemarketer or spammer, politely decline their offer and end the call. If it is a legitimate personal or business call, assure them you will pass the message along. Be concise, helpful, and courteous at all times."
    }
};

export async function POST(request: Request) {
    try {
        const { personaId, greeting, greetingType } = await request.json();
        const persona = PERSONAS[personaId as keyof typeof PERSONAS];

        if (!persona) {
            return NextResponse.json({ error: "Invalid persona" }, { status: 400 });
        }

        // Determine the greeting text
        let firstMessage = "";
        if (greetingType === "custom") {
            firstMessage = greeting;
        } else if (greetingType === "standard") {
            firstMessage = "The person you are calling is busy. Please leave a message.";
        } else if (greetingType === "professional") {
            firstMessage = "You have reached the office. Please leave your name and number.";
        } else {
            // Default fallback if nothing sent
            firstMessage = "Hello?";
        }

        // Call Vapi API to update the assistant
        const response = await fetch(`https://api.vapi.ai/assistant/${VAPI_CONFIG.assistantId}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${VAPI_CONFIG.apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: {
                    provider: "openai",
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content: persona.systemPrompt
                        }
                    ]
                },
                voice: {
                    provider: "11labs",
                    voiceId: persona.voiceId
                },
                firstMessage: firstMessage
            })
        });

        if (!response.ok) {
            throw new Error(`Vapi API error: ${response.statusText}`);
        }

        return NextResponse.json({ success: true, persona: personaId, greeting: firstMessage });

    } catch (error) {
        console.error("Failed to update persona:", error);
        return NextResponse.json({ error: "Failed to update persona" }, { status: 500 });
    }
}
