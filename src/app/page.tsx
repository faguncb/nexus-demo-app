'use client';

import { useMemo, useState } from 'react';
import ConnectButton from '@/components/connect-button';
import InitButton from '@/components/init-button';
import RegisterHooksButton from '@/components/register-hooks-button';
import FetchUnifiedBalanceButton from '@/components/fetch-unified-balance-button';
import DeinitButton from '@/components/de-init-button';
import TransferProgress from '@/components/transfer-progress';
import TransferForm from '@/components/transfer-form';
import { isInitialized, SUPPORTED_CHAINS } from '@/src/lib/nexus';

export default function Page() {
    const [initialized, setInitialized] = useState(isInitialized());
    const [balances, setBalances] = useState<any>(null);
    const [showBalancesModal, setShowBalancesModal] = useState(false);

    const assets = useMemo(() => {
        if (!balances) return [];
        if (Array.isArray(balances)) return balances;
        if (Array.isArray((balances as any).assets)) return (balances as any).assets;
        return [];
    }, [balances]);

    const uniqueTokens = useMemo(() => {
        return new Set(
            assets.map((asset: any) => (asset?.symbol ?? asset?.token ?? asset?.name ?? 'Unknown Token').toString()),
        ).size;
    }, [assets]);

    const formatAmount = (value: any) => {
        const raw =
            value ??
            value === 0
                ? value
                : undefined;
        if (raw === undefined || raw === null) return '-';
        const asNumber = typeof raw === 'number' ? raw : Number(raw);
        if (!Number.isFinite(asNumber)) return String(raw);
        if (Math.abs(asNumber) >= 1) {
            return asNumber.toLocaleString(undefined, { maximumFractionDigits: 4 });
        }
        return asNumber.toLocaleString(undefined, { maximumFractionDigits: 8 });
    };

    const getSymbol = (asset: any) => asset?.symbol ?? asset?.token ?? asset?.name ?? 'Unknown Token';
    const getChainLabel = (asset: any) => {
        const id =
            asset?.chainId ??
            asset?.chain?.id ??
            (typeof asset?.chain === 'number' ? asset.chain : undefined) ??
            asset?.network?.chainId ??
            asset?.network?.id ??
            asset?.destinationChainId ??
            asset?.sourceChainId ??
            asset?.chainID;
        if (id !== undefined && id !== null) {
            const meta = SUPPORTED_CHAINS[id as keyof typeof SUPPORTED_CHAINS];
            if (meta?.name) return meta.name;
            return `Chain ${id}`;
        }
        return 'Unknown Chain';
    };
    const getUsdValue = (asset: any) => asset?.balanceInFiat ?? asset?.valueUSD ?? asset?.usdValue;
    const getWalletAddress = (asset: any) =>
        asset?.address ??
        asset?.walletAddress ??
        asset?.account ??
        asset?.owner ??
        null;

    const btn =
        'px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 ' +
        'disabled:opacity-50 disabled:cursor-not-allowed';

    return (
        <>
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
                    onResult={(r) => {
                        setBalances(r);
                        setShowBalancesModal(true);
                    }}
                />
                <TransferForm />
                <DeinitButton
                    className={btn}
                    onDone={() => {
                        setInitialized(false);
                        setBalances(null);
                        setShowBalancesModal(false);
                    }}
                />

                <div className="mt-4 text-center">
                    <b>Nexus SDK Status:</b>{' '}
                    {initialized ? 'Initialized' : 'Not initialized'}
                </div>

                {/* ←←← NEW: Real-time progress feed */}
                <TransferProgress />
            </div>
            </main>
            {showBalancesModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
                    onClick={() => setShowBalancesModal(false)}
                >
                    <div
                        className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Unified Balances</h2>
                            <button
                                onClick={() => setShowBalancesModal(false)}
                                className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
                                aria-label="Close unified balances"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="mt-4 space-y-4">
                            {assets.length === 0 ? (
                                <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-500">
                                    No unified balances found. Try fetching again after a transfer.
                                </div>
                            ) : (
                                <>
                                    <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                                        <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-600">
                                            {assets.length} asset{assets.length === 1 ? '' : 's'}
                                        </span>
                                        <span className="rounded-full bg-purple-50 px-3 py-1 text-purple-600">
                                            {uniqueTokens} token{uniqueTokens === 1 ? '' : 's'}
                                        </span>
                                    </div>
                                    <ul className="max-h-96 overflow-auto rounded-lg border border-gray-200 divide-y divide-gray-100">
                                        {assets.map((asset: any, idx: number) => {
                                            const amount =
                                                asset?.formattedBalance ??
                                                asset?.balance ??
                                                asset?.amount ??
                                                asset?.value ??
                                                asset?.quantity;
                                            const usdValue = getUsdValue(asset);
                                        return (
                                                <li key={`${getSymbol(asset)}-${idx}`} className="flex items-center justify-between gap-4 p-4">
                                                    <div>
                                                        <div className="text-sm font-semibold text-gray-900">
                                                            {getSymbol(asset)}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {getChainLabel(asset)}
                                                            {getWalletAddress(asset) && (
                                                                <span className="ml-2 inline-block rounded bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                                                                    {getWalletAddress(asset)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-sm font-semibold text-gray-900">
                                                            {formatAmount(amount)}
                                                        </div>
                                                        {usdValue !== undefined && usdValue !== null && (
                                                            <div className="text-xs text-gray-500">
                                                                ≈ ${formatAmount(usdValue)}
                                                            </div>
                                                        )}
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}