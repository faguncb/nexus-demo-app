import { ethers } from 'ethers';

// ... existing imports ...

// ---------------------------------------------------------------------
// Supported chains & token list (testnet)
// ---------------------------------------------------------------------
export const SUPPORTED_CHAINS = {
    11155111: { name: 'Sepolia', native: 'ETH' },
    84532: { name: 'Base Sepolia', native: 'ETH' },
    421614: { name: 'Arbitrum Sepolia', native: 'ETH' },
    11155420: { name: 'Optimism Sepolia', native: 'ETH' },
};

export const TEST_TOKENS = {
    // USDC on Sepolia
    '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238': {
        symbol: 'USDC',
        decimals: 6,
        chains: [11155111],
    },
    // Mock DAI on Base Sepolia (replace with real if needed)
    '0x11fe4b6ae13d2a6055c8d89530d10d79d5d95d9d': {
        symbol: 'DAI',
        decimals: 18,
        chains: [84532],
    },
};

// ---------------------------------------------------------------------
// Get token address on a specific chain
// ---------------------------------------------------------------------
export function getTokenOnChain(symbol: string, chainId: number): string | null {
    for (const [addr, info] of Object.entries(TEST_TOKENS)) {
        if (info.symbol === symbol && info.chains.includes(chainId)) {
            return addr;
        }
    }
    return null;
}

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
// Progress event listener system
// ---------------------------------------------------------------------
export interface ProgressEvent {
    type: string;
    intentId?: string;
    status?: 'pending' | 'submitted' | 'proving' | 'finalizing' | 'completed' | 'failed';
    txHash?: string;
    chainId?: number;
    message?: string;
}

type ProgressListener = (event: ProgressEvent) => void;

const progressListeners: Set<ProgressListener> = new Set();

export function addProgressListener(listener: ProgressListener) {
    progressListeners.add(listener);
}

export function removeProgressListener(listener: ProgressListener) {
    progressListeners.delete(listener);
}

function emitProgress(event: ProgressEvent) {
    progressListeners.forEach((listener) => {
        try {
            listener(event);
        } catch (error) {
            console.error('Error in progress listener:', error);
        }
    });
}

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

export async function transfer(params: {
    fromChainId: number;
    toChainId: number;
    token: string;
    amount: bigint;
    recipient?: string;
}) {
    const sdk = await getSdk();
    return await sdk.transfer(params);
}

export async function bridge(params: {
    fromChainId: number;
    toChainId: number;
    token: string;
    amount: bigint;
    recipient?: string;
}) {
    const sdk = await getSdk();
    return await sdk.bridge(params);
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