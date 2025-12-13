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
