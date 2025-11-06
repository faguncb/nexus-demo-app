'use client';

import { sdk, isInitialized } from '@/src/lib/nexus';
import { ethers } from 'ethers';

export default function TransferButton({
                                           className,
                                       }: { className?: string }) {
    const onClick = async () => {
        if (!isInitialized()) return alert('Initialize SDK first');

        // ---- Demo values (replace with form inputs in a real app) ----
        const fromChainId = 11155111; // Sepolia
        const toChainId = 84532;      // Base Sepolia
        const token = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'; // USDC on Sepolia
        const amount = ethers.parseUnits('0.01', 6); // 0.01 USDC (6 decimals)

        try {
            const txHash = await sdk.transfer({
                fromChainId,
                toChainId,
                token,
                amount,
                // optional: recipient address on destination chain
                // recipient: '0x...',
            });
            alert(`Transfer submitted! Tx hash: ${txHash}`);
        } catch (e: any) {
            alert(e?.message ?? 'Transfer failed');
        }
    };

    return (
        <button className={className} onClick={onClick} disabled={!isInitialized()}>
            Demo Transfer (0.01 USDC)
        </button>
    );
}