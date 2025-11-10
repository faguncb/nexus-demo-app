'use client';

import { bridge, isInitialized } from '@/src/lib/nexus';
import { ethers } from 'ethers';

type Props = {
    className?: string;
};

export default function BridgeButton({ className }: Props) {
    const onClick = async () => {
        if (!isInitialized()) return alert('Initialize SDK first');

        // Demo values mirroring transfer button defaults
        const fromChainId = 11155111; // Sepolia
        const toChainId = 84532; // Base Sepolia
        const token = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'; // USDC on Sepolia
        const amount = ethers.parseUnits('0.01', 6); // 0.01 USDC (6 decimals)

        try {
            const txHash = await bridge({
                fromChainId,
                toChainId,
                token,
                amount,
            });
            alert(`Bridge submitted! Tx hash: ${txHash}`);
        } catch (error: any) {
            alert(error?.message ?? 'Bridge failed');
        }
    };

    return (
        <button className={className} onClick={onClick} disabled={!isInitialized()}>
            Demo Bridge (0.01 USDC)
        </button>
    );
}


