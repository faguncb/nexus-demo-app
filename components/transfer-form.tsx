'use client';

import { useState } from 'react';
import { transfer, bridge, isInitialized, SUPPORTED_CHAINS, getTokenOnChain, TEST_TOKENS } from '@/src/lib/nexus';
import { ethers } from 'ethers';

interface Props {
    onProgress?: (e: any) => void;
}

export default function TransferForm({ onProgress }: Props) {
    const [fromChain, setFromChain] = useState<number>(11155111);
    const [toChain, setToChain] = useState<number>(84532);
    const [tokenSymbol, setTokenSymbol] = useState<string>('USDC');
    const [amount, setAmount] = useState<string>('0.01');
    const [mode, setMode] = useState<'transfer' | 'bridge'>('transfer');
    const [loading, setLoading] = useState(false);
    const [lastTx, setLastTx] = useState<string | null>(null);

    const chains = Object.entries(SUPPORTED_CHAINS).map(([id, info]) => ({
        id: Number(id),
        ...info,
    }));

    const tokens = Object.values(TEST_TOKENS).filter((t) =>
        t.chains.includes(fromChain)
    );

    const submit = async () => {
        if (!isInitialized()) return alert('Initialize SDK first');
        if (fromChain === toChain) return alert('Source and dest chain must differ');

        const tokenAddr = getTokenOnChain(tokenSymbol, fromChain);
        if (!tokenAddr) return alert('Token not available on source chain');

        setLoading(true);
        setLastTx(null);
        onProgress?.({
            type: mode,
            status: 'pending',
            chainId: fromChain,
            message: 'Submitting transaction...',
        });

        try {
            const amountWei = ethers.parseUnits(amount, TEST_TOKENS[tokenAddr].decimals);

            let txHash: string;
            if (mode === 'transfer') {
                txHash = await transfer({
                    fromChainId: fromChain,
                    toChainId: toChain,
                    token: tokenAddr,
                    amount: amountWei,
                });
            } else {
                txHash = await bridge({
                    fromChainId: fromChain,
                    toChainId: toChain,
                    token: tokenAddr,
                    amount: amountWei,
                });
            }

            setLastTx(txHash);
            onProgress?.({
                type: mode,
                status: 'submitted',
                chainId: toChain,
                txHash,
                message: 'Transaction submitted to network',
            });
            alert(`${mode.toUpperCase()} submitted! Tx: ${txHash.slice(0, 10)}...`);
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

    return (
        <div className="mt-6 w-full max-w-md bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-bold mb-4">
                {mode === 'transfer' ? 'Transfer' : 'Bridge'} Tokens
            </h3>

            <div className="space-y-4">
                {/* Mode Toggle */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setMode('transfer')}
                        className={`flex-1 py-2 rounded ${mode === 'transfer' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    >
                        Transfer
                    </button>
                    <button
                        onClick={() => setMode('bridge')}
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
                        onChange={(e) => setFromChain(Number(e.target.value))}
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
                    <select
                        value={toChain}
                        onChange={(e) => setToChain(Number(e.target.value))}
                        className="mt-1 w-full p-2 border rounded"
                    >
                        {chains
                            .filter((c) => c.id !== fromChain)
                            .map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                    </select>
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
                            View Tx: {lastTx.slice(0, 10)}...
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}