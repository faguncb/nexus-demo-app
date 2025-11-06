'use client';

import { deinit, isInitialized } from '@/src/lib/nexus';

export default function DeinitButton({
                                         className,
                                         onDone,
                                     }: { className?: string; onDone?: () => void }) {
    // Inside DeinitButton component
    const onClick = async () => {
        await deinit();
        onDone?.();
        // Optionally clear UI state
        window.location.reload(); // or dispatch a custom event
    };
    return <button className={className} onClick={onClick} disabled={!isInitialized()}>De-initialize</button>;
}