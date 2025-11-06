import { ethers } from 'ethers';

function ensurePolyfills() {
    try {
        // Buffer for browser runtime
        if (typeof window !== 'undefined' && (window as any).Buffer === undefined) {
            const { Buffer } = require('buffer');
            (window as any).Buffer = Buffer;
        }
    } catch (_) {
        // no-op if require not available in this context
    }
}

let sdkPromise: Promise<any> | null = null;
let sdkInstance: any | null = null;
async function getSdk() {
    if (!sdkPromise) {
        ensurePolyfills();
        sdkPromise = import('@avail-project/nexus-core').then(({ NexusSDK }) => {
            sdkInstance = new NexusSDK({ network: 'testnet' });
            return sdkInstance;
        });
    }
    return sdkPromise;
}

// ---------------------------------------------------------------------
// SDK instance
// ---------------------------------------------------------------------
// Deprecated direct export removed; use getSdk() internally

// ---------------------------------------------------------------------
// Helper wrappers (unchanged)
// ---------------------------------------------------------------------
export function isInitialized() {
    return sdkInstance?.isInitialized?.() ?? false;
}

export async function initializeWithProvider(provider: any) {
    if (!provider) throw new Error('No EIP-1193 provider (e.g., MetaMask) found');
    const sdk = await getSdk();
    if (sdk.isInitialized()) return;
    await sdk.initialize(provider);
}

export async function deinit() {
    const sdk = await getSdk();
    if (!sdk.isInitialized()) return;
    await sdk.deinit();
}

export async function getUnifiedBalances() {
    const sdk = await getSdk();
    return await sdk.getUnifiedBalances();
}

// ---------------------------------------------------------------------
// NEW: Hook registration (call once after init)
// ---------------------------------------------------------------------
export async function registerApprovalHooks(provider: any) {
    const sdk = await getSdk();
    const ethersProvider = new ethers.BrowserProvider(provider);
    const signer = await ethersProvider.getSigner();

    // ---- Intent hook ---------------------------------------------------
    sdk.setOnIntentHook(async (intent) => {
        // 1. Show the user what will happen
        const msg = `
You are about to submit a cross-chain intent:

From: ${intent.fromChainId} → To: ${intent.toChainId}
Token: ${intent.token}   Amount: ${intent.amount}
    `.trim();

        if (!confirm(msg)) throw new Error('User rejected intent');

        // 2. Ask for a typed-data signature (EIP-712)
        const domain = {
            name: 'Avail Nexus',
            version: '1',
            chainId: await ethersProvider.getSigner().getChainId(),
            verifyingContract: '0x0000000000000000000000000000000000000000', // placeholder
        };

        const types = {
            Intent: [
                { name: 'fromChainId', type: 'uint256' },
                { name: 'toChainId', type: 'uint256' },
                { name: 'token', type: 'address' },
                { name: 'amount', type: 'uint256' },
            ],
        };

        const value = {
            fromChainId: intent.fromChainId,
            toChainId: intent.toChainId,
            token: intent.token,
            amount: intent.amount,
        };

        const signature = await signer.signTypedData(domain, types, value);
        return signature; // SDK will attach this to the intent payload
    });

    // ---- Allowance hook ------------------------------------------------
    sdk.setOnAllowanceHook(async (allowance) => {
        const msg = `
You need to approve the Nexus router to spend your tokens.

Token: ${allowance.token}
Amount: ${allowance.amount} (or unlimited)
    `.trim();

        if (!confirm(msg)) throw new Error('User rejected allowance');

        // Use the same signer to send an ERC-20 `approve` tx
        const erc20Abi = [
            'function approve(address spender, uint256 amount) public returns (bool)',
        ];
        const tokenContract = new ethers.Contract(allowance.token, erc20Abi, signer);

        const tx = await tokenContract.approve(allowance.spender, allowance.amount);
        await tx.wait();

        // Return the transaction hash – SDK only needs to know it succeeded
        return tx.hash;
    });
}