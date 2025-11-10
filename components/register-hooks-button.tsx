'use client';

import { registerApprovalHooks, isInitialized } from '@/src/lib/nexus';

type Props = {
    className?: string;
};

export default function RegisterHooksButton({ className }: Props) {
    const onClick = async () => {
        if (!isInitialized()) {
            alert('Initialize Nexus first');
            return;
        }

        const provider = (window as any)?.ethereum;
        if (!provider) {
            alert('No EIP-1193 provider found');
            return;
        }

        try {
            await registerApprovalHooks(provider);
            alert('Approval hooks registered');
        } catch (e: any) {
            alert(e?.message ?? 'Failed to register hooks');
        }
    };

    return (
        <button className={className} onClick={onClick} disabled={!isInitialized()}>
            Register Approval Hooks
        </button>
    );
}