'use client';

import { useEffect, useState } from 'react';
import { addProgressListener, removeProgressListener } from '@/src/lib/nexus';

interface ProgressEvent {
    type: string;
    intentId?: string;
    status?:
        | 'pending'
        | 'submitted'
        | 'proving'
        | 'finalizing'
        | 'completed'
        | 'failed';
    txHash?: string;
    chainId?: number;
    message?: string;
}

export default function TransferProgress() {
    const [events, setEvents] = useState<ProgressEvent[]>([]);

    useEffect(() => {
        const handler = (e: ProgressEvent) => {
            setEvents((prev) => [...prev.slice(-9), e]); // keep last 10
        };

        addProgressListener(handler);

        return () => {
            removeProgressListener(handler);
        };
    }, []);

    if (events.length === 0) return null;

    const statusEmoji = (s?: string) => {
        switch (s) {
            case 'pending': return '⏳';
            case 'submitted': return '📤';
            case 'proving': return '🔍';
            case 'finalizing': return '🔗';
            case 'completed': return '✅';
            case 'failed': return '❌';
            default: return 'ℹ️';
        }
    };

    return (
        <div className="mt-6 w-full max-w-md">
            <h3 className="font-semibold mb-2">Transfer Progress</h3>
            <div className="bg-gray-50 rounded-lg p-3 space-y-1 text-sm font-mono">
                {events.map((e, i) => (
                    <div
                        key={i}
                        className="flex items-start gap-2 animate-fade-in"
                        style={{ animationDelay: `${i * 50}ms` }}
                    >
                        <span>{statusEmoji(e.status)}</span>
                        <div className="flex-1">
                            <span className="font-medium">{e.type}</span>
                            {e.status && (
                                <span className="ml-2 text-xs text-gray-600">({e.status})</span>
                            )}
                            {e.chainId && <span className="ml-2">Chain {e.chainId}</span>}
                            {e.txHash && (
                                <a
                                    href={`https://sepolia.etherscan.io/tx/${e.txHash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-2 text-blue-600 underline text-xs"
                                >
                                    {e.txHash.slice(0, 8)}...
                                </a>
                            )}
                            {e.message && <div className="text-xs text-gray-500">{e.message}</div>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}