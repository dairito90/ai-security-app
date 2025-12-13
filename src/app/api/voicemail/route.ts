import { NextResponse } from "next/server";
import { getVoicemails, markVoicemailRead, deleteVoicemail } from "@/lib/store";

export async function GET() {
    const voicemails = getVoicemails();
    return NextResponse.json(voicemails);
}

export async function PATCH(request: Request) {
    const { id } = await request.json();
    markVoicemailRead(id);
    return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (id) {
        deleteVoicemail(id);
        return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
}
