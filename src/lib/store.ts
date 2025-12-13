import fs from 'fs';
import path from 'path';
import { CallEvent } from './simulation';

const DATA_FILE = path.join(process.cwd(), 'voicemails.json');

export interface Voicemail extends CallEvent {
    isRead: boolean;
    duration: string;
}

export function getVoicemails(): Voicemail[] {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            return [];
        }
        const data = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading voicemails:", error);
        return [];
    }
}

export function saveVoicemail(voicemail: Voicemail) {
    try {
        const current = getVoicemails();
        const updated = [voicemail, ...current];
        fs.writeFileSync(DATA_FILE, JSON.stringify(updated, null, 2));
    } catch (error) {
        console.error("Error saving voicemail:", error);
    }
}

export function markVoicemailRead(id: string) {
    try {
        const current = getVoicemails();
        const updated = current.map(v => v.id === id ? { ...v, isRead: true } : v);
        fs.writeFileSync(DATA_FILE, JSON.stringify(updated, null, 2));
    } catch (error) {
        console.error("Error marking voicemail read:", error);
    }
}

export function deleteVoicemail(id: string) {
    try {
        const current = getVoicemails();
        const updated = current.filter(v => v.id !== id);
        fs.writeFileSync(DATA_FILE, JSON.stringify(updated, null, 2));
    } catch (error) {
        console.error("Error deleting voicemail:", error);
    }
}

// --- General Call Log Storage ---
const CALLS_FILE = path.join(process.cwd(), 'calls.json');

export function getCalls(): CallEvent[] {
    try {
        if (!fs.existsSync(CALLS_FILE)) {
            return [];
        }
        const data = fs.readFileSync(CALLS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading calls:", error);
        return [];
    }
}

export function saveCall(call: CallEvent) {
    try {
        const current = getCalls();
        // Limit to last 100 calls
        const updated = [call, ...current].slice(0, 100);
        fs.writeFileSync(CALLS_FILE, JSON.stringify(updated, null, 2));
    } catch (error) {
        console.error("Error saving call:", error);
    }
}
