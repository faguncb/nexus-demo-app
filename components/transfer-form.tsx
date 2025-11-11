'use client';

import { useEffect, useMemo, useState } from 'react';
import { transfer, bridge, isInitialized, SUPPORTED_CHAINS, getTokenOnChain, TEST_TOKENS, isMainnetChain } from '@/src/lib/nexus';
import { ethers } from 'ethers';

interface Props {
    onProgress?: (e: any) => void;
}

export default function TransferForm({ onProgress }: Props) {
    const [fromChain, setFromChain] = useState<number>(1);
    const [toChain, setToChain] = useState<number>(1);
    const [tokenSymbol, setTokenSymbol] = useState<string>('USDC');
    const [amount, setAmount] = useState<string>('0.01');
    const [mode, setMode] = useState<'transfer' | 'bridge'>('transfer');
    const [recipient, setRecipient] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [lastTx, setLastTx] = useState<string | null>(null);

    const chains = Object.entries(SUPPORTED_CHAINS).map(([id, info]) => ({
        id: Number(id),
        ...info,
    }));

    const mainnetChains = useMemo(
        () => Object.entries(SUPPORTED_CHAINS)
            .map(([id, info]) => ({ id: Number(id), ...info }))
            .filter((c) => isMainnetChain(c.id)),
        []
    );
    const testnetChains = useMemo(
        () => Object.entries(SUPPORTED_CHAINS)
            .map(([id, info]) => ({ id: Number(id), ...info }))
            .filter((c) => !isMainnetChain(c.id)),
        []
    );

    const tokens = useMemo(() => {
        const availableOnSource = TEST_TOKENS.filter((t) => t.chains.includes(fromChain));
        if (mode === 'bridge') {
            return availableOnSource.filter((t) => t.chains.includes(toChain));
        }
        return availableOnSource;
    }, [fromChain, toChain, mode]);

    useEffect(() => {
        if (!tokens.some((t) => t.symbol === tokenSymbol)) {
            if (tokens.length > 0) {
                setTokenSymbol(tokens[0].symbol);
            }
        }
    }, [tokens, tokenSymbol]);

    const toChainCandidates = useMemo(() => {
        const group = isMainnetChain(fromChain) ? mainnetChains : testnetChains;
        return group.filter((c) => c.id !== fromChain);
    }, [fromChain, mainnetChains, testnetChains]);

    const submit = async () => {
        if (!isInitialized()) return alert('Initialize SDK first');
        if (mode === 'bridge') {
            if (fromChain === toChain) {
                return alert('Source and destination chains must differ for bridge');
            }
            if (isMainnetChain(fromChain) !== isMainnetChain(toChain)) {
                return alert('Bridge currently supports only intra-environment transfers (mainnet↔︎mainnet or testnet↔︎testnet).');
            }
        }

        const tokenMeta = getTokenOnChain(tokenSymbol, fromChain);
        if (!tokenMeta) return alert('Token not available on source chain');
        if (mode === 'bridge' && !getTokenOnChain(tokenSymbol, toChain)) {
            return alert('Token not available on destination chain');
        }

        if (mode === 'transfer') {
            if (!recipient.trim()) {
                return alert('Destination address is required for transfers');
            }
            if (!ethers.isAddress(recipient.trim())) {
                return alert('Destination address is invalid');
            }
        }

        setLoading(true);
        setLastTx(null);
        onProgress?.({
            type: mode,
            status: 'pending',
            chainId: fromChain,
            message:
                mode === 'transfer'
                    ? `Submitting transfer to ${recipient.trim()}`
                    : 'Submitting transaction...',
        });

        try {
            const amountWei = ethers.parseUnits(amount, tokenMeta.decimals);

            let txHash: string;
            if (mode === 'transfer') {
                txHash = await transfer({
                    fromChainId: fromChain,
                    toChainId: toChain,
                    token: tokenSymbol,
                    amount: amountWei,
                    recipient: mode === 'transfer' ? recipient.trim() : undefined,
                });
            } else {
                txHash = await bridge({
                    fromChainId: fromChain,
                    toChainId: toChain,
                    token: tokenSymbol,
                    amount: amountWei,
                });
            }

            setLastTx(txHash);
            onProgress?.({
                type: mode,
                status: 'submitted',
                chainId: toChain,
                txHash,
                message:
                    mode === 'transfer'
                        ? `Transfer submitted to ${recipient.trim()}`
                        : 'Transaction submitted to network',
                recipient: mode === 'transfer' ? recipient.trim() : undefined,
            });
            const label = txHash ? txHash.slice(0, 10) : 'N/A';
            alert(`${mode.toUpperCase()} submitted! Tx: ${label}...`);
        } catch (e: any) {
            onProgress?.({
                type: mode,
                status: 'failed',
                chainId: fromChain,
                message: e?.message ?? `${mode} failed`,
            });
            alert(e?.message ?? `${mode} failed`);
        } finally {
            setLoading(false);
        }
    };

    const setTransferMode = () => {
        setMode('transfer');
        setToChain(fromChain);
    };

    const setBridgeMode = () => {
        setMode('bridge');
        const group = isMainnetChain(fromChain) ? mainnetChains : testnetChains;
        if (!group.some((c) => c.id === toChain) || fromChain === toChain) {
            const fallback = group.find((c) => c.id !== fromChain);
            if (fallback) {
                setToChain(fallback.id);
            }
        }
    };

    const handleFromChainChange = (value: number) => {
        setFromChain(value);
        // token reset handled by effect
        if (mode === 'transfer') {
            setToChain(value);
        } else if (mode === 'bridge') {
            const group = isMainnetChain(value) ? mainnetChains : testnetChains;
            if (!group.some((c) => c.id === toChain) || value === toChain) {
                const fallback = group.find((c) => c.id !== value);
                if (fallback) {
                    setToChain(fallback.id);
                }
            }
        }
    };

    return (
        <div className="mt-6 w-full max-w-md bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-bold mb-4">
                {mode === 'transfer' ? 'Transfer' : 'Bridge'} Tokens
            </h3>

            <div className="space-y-4">
                {/* Mode Toggle */}
                <div className="flex gap-2">
                    <button
                        onClick={setTransferMode}
                        className={`flex-1 py-2 rounded ${mode === 'transfer' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    >
                        Transfer
                    </button>
                    <button
                        onClick={setBridgeMode}
                        className={`flex-1 py-2 rounded ${mode === 'bridge' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    >
                        Bridge
                    </button>
                </div>

                {/* From Chain */}
                <div>
                    <label className="block text-sm font-medium">From Chain</label>
                    <select
                        value={fromChain}
                        onChange={(e) => handleFromChainChange(Number(e.target.value))}
                        className="mt-1 w-full p-2 border rounded"
                    >
                        {chains.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* To Chain */}
                <div>
                    <label className="block text-sm font-medium">To Chain</label>
                    {mode === 'bridge' ? (
                        <select
                            value={toChain}
                            onChange={(e) => setToChain(Number(e.target.value))}
                            className="mt-1 w-full p-2 border rounded"
                        >
                        {toChainCandidates.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                        </select>
                    ) : (
                        <div className="mt-1 w-full p-2 border rounded bg-gray-100 text-gray-700">
                            {chains.find((c) => c.id === fromChain)?.name ?? 'Select a chain'}
                        </div>
                    )}
                </div>

                {/* Token */}
                <div>
                    <label className="block text-sm font-medium">Token</label>
                    <select
                        value={tokenSymbol}
                        onChange={(e) => setTokenSymbol(e.target.value)}
                        className="mt-1 w-full p-2 border rounded"
                    >
                        {tokens.map((t) => (
                            <option key={t.symbol} value={t.symbol}>
                                {t.symbol}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Amount */}
                <div>
                    <label className="block text-sm font-medium">Amount</label>
                    <input
                        type="text"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="mt-1 w-full p-2 border rounded"
                        placeholder="0.01"
                    />
                </div>

                {/* Recipient (Transfer only) */}
                {mode === 'transfer' && (
                    <div>
                        <label className="block text-sm font-medium">Destination Address</label>
                        <input
                            type="text"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            className="mt-1 w-full p-2 border rounded"
                            placeholder="0x..."
                        />
                    </div>
                )}

                {/* Submit */}
                <button
                    onClick={submit}
                    disabled={loading || !isInitialized()}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg disabled:opacity-50"
                >
                    {loading ? 'Submitting...' : `Submit ${mode.toUpperCase()}`}
                </button>

                {/* Tx Link */}
                {lastTx && (
                    <div className="mt-3 text-center">
                        <a
                            href={`https://sepolia.etherscan.io/tx/${lastTx}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 underline"
                        >
                            View Tx: {lastTx.length > 0 ? lastTx.slice(0, 10) : 'N/A'}...
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}