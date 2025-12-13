"use client";

import { useEffect, useState } from "react";

export default function DebugPage() {
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/webhooks/vapi")
            .then(res => res.json())
            .then(setData)
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="p-8 bg-black text-white min-h-screen font-mono">
            <h1 className="text-2xl font-bold mb-4">Debug: Real Data Feed</h1>
            <p className="mb-4 text-gray-400">This page shows exactly what the server sees from Vapi.</p>

            {loading && <div className="text-yellow-500">Loading data...</div>}

            {error && (
                <div className="p-4 bg-red-900/50 border border-red-500 rounded text-red-200 mb-4">
                    Error: {error}
                </div>
            )}

            {data && (
                <div className="space-y-4">
                    <div className="p-4 bg-gray-900 rounded border border-gray-800">
                        <h2 className="text-xl font-bold mb-2">Raw API Response</h2>
                        <pre className="whitespace-pre-wrap text-xs text-green-400 overflow-auto max-h-[500px]">
                            {JSON.stringify(data, null, 2)}
                        </pre>
                    </div>

                    <div className="p-4 bg-gray-900 rounded border border-gray-800">
                        <h2 className="text-xl font-bold mb-2">Summary</h2>
                        <p>Total Calls Found: {Array.isArray(data) ? data.length : "Not an array"}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
