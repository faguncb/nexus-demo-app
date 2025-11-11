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

    const detailedAssets = useMemo(() => {
        return assets.map((asset: any) => {
            const symbol = asset?.symbol ?? asset?.token ?? asset?.name ?? 'Unknown Token';
            const chainLabel = getChainLabel(asset);
            const breakdown = Array.isArray(asset?.breakdown) ? asset.breakdown : [];
            const components = breakdown.length
                ? breakdown.map((b: any) => ({
                    chainName: b?.chain?.name ?? `Chain ${b?.chain?.id ?? ''}`.trim(),
                    balance: b?.balance ?? b?.formattedBalance ?? b?.amount ?? 0,
                }))
                : [
                    {
                        chainName: chainLabel,
                        balance: asset?.balance ?? asset?.formattedBalance ?? asset?.amount ?? 0,
                    },
                ];
            const totalBalance =
                asset?.balance ??
                asset?.formattedBalance ??
                asset?.amount ??
                asset?.value ??
                asset?.quantity ??
                0;
            return {
                symbol,
                chainLabel,
                totalBalance,
                components,
                usdValue: asset?.balanceInFiat ?? asset?.valueUSD ?? asset?.usdValue,
                nativeCurrency: asset?.nativeCurrency,
            };
        });
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
                                    <div className="max-h-96 overflow-auto rounded-lg border border-gray-200">
                                        {detailedAssets.map((asset, idx) => (
                                            <div key={`${asset.symbol}-${idx}`} className="border-b border-gray-100 p-4 last:border-b-0">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div>
                                                        <div className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                                            {asset.symbol}
                                                            <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
                                                                {asset.chainLabel}
                                                            </span>
                                                        </div>
                                                        {getWalletAddress(assets[idx]) && (
                                                            <div className="mt-1 text-xs text-gray-500">
                                                                Wallet: {getWalletAddress(assets[idx])}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-sm font-semibold text-gray-900">
                                                            {formatAmount(asset.totalBalance)} {asset.symbol}
                                                        </div>
                                                        {asset.usdValue !== undefined && asset.usdValue !== null && (
                                                            <div className="text-xs text-gray-500">
                                                                ≈ ${formatAmount(asset.usdValue)}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                {asset.components.length > 1 && (
                                                    <div className="mt-3 rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
                                                        <div className="font-semibold text-gray-700 mb-2">Breakdown</div>
                                                        <div className="grid gap-1">
                                                            {asset.components.map((component, cIdx) => (
                                                                <div key={`${asset.symbol}-${component.chainName}-${cIdx}`} className="flex justify-between">
                                                                    <span>{component.chainName}</span>
                                                                    <span>{formatAmount(component.balance)}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}