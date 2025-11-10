'use client';

import { getUnifiedBalances, isInitialized } from '@/src/lib/nexus';

export default function FetchUnifiedBalanceButton({
                                                      className,
                                                      onResult,
                                                  }: { className?: string; onResult?: (r: any) => void }) {
    const onClick = async () => {
        if (!isInitialized()) return alert('Initialize first');
        try {
            const res = await getUnifiedBalances();
            onResult?.(res ?? []);
            console.log(res);
        } catch (error: any) {
            console.error('Failed to fetch unified balances', error);
            alert(error?.message ?? 'Failed to fetch balances');
        }
    };
    return <button className={className} onClick={onClick} disabled={!isInitialized()}>Fetch Unified Balances</button>;
}