'use client';

import { useState } from 'react';
import ConnectButton from '@/components/connect-button';
import InitButton from '@/components/init-button';
import RegisterHooksButton from '@/components/register-hooks-button';
import FetchUnifiedBalanceButton from '@/components/fetch-unified-balance-button';
import DeinitButton from '@/components/de-init-button';
import TransferProgress from '@/components/transfer-progress';
import TransferForm from '@/components/transfer-form';
import { isInitialized } from '@/src/lib/nexus';

export default function Page() {
    const [initialized, setInitialized] = useState(isInitialized());
    const [balances, setBalances] = useState<any>(null);

    const btn =
        'px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 ' +
        'disabled:opacity-50 disabled:cursor-not-allowed';

    return (
        <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-4">
            <div className="flex flex-col items-center gap-4 w-full max-w-md">
                <ConnectButton className={btn} />
                <InitButton
                    className={btn}
                    onReady={() => setInitialized(true)}
                />
                <RegisterHooksButton className={btn} />
                <FetchUnifiedBalanceButton
                    className={btn}
                    onResult={(r) => setBalances(r)}
                />
                <TransferForm />
                <DeinitButton
                    className={btn}
                    onDone={() => {
                        setInitialized(false);
                        setBalances(null);
                    }}
                />

                <div className="mt-4 text-center">
                    <b>Nexus SDK Status:</b>{' '}
                    {initialized ? 'Initialized' : 'Not initialized'}
                </div>

                {balances && (
                    <pre className="mt-4 p-4 bg-gray-100 rounded whitespace-pre-wrap text-xs overflow-auto max-w-full">
            {JSON.stringify(balances, null, 2)}
          </pre>
                )}

                {/* ←←← NEW: Real-time progress feed */}
                <TransferProgress />
            </div>
        </main>
    );
}