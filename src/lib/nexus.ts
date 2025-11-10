import { ethers } from 'ethers';

// ... existing imports ...

// ---------------------------------------------------------------------
// Supported chains & token list (testnet)
// ---------------------------------------------------------------------
export const SUPPORTED_CHAINS = {
    1: { name: 'Ethereum Mainnet', native: 'ETH' },
    10: { name: 'Optimism', native: 'ETH' },
    56: { name: 'BNB Chain', native: 'BNB' },
    137: { name: 'Polygon PoS', native: 'MATIC' },
    8453: { name: 'Base Mainnet', native: 'ETH' },
    42161: { name: 'Arbitrum One', native: 'ETH' },
    43114: { name: 'Avalanche C-Chain', native: 'AVAX' },
    534352: { name: 'Scroll', native: 'ETH' },
    11155111: { name: 'Sepolia', native: 'ETH' },
    84532: { name: 'Base Sepolia', native: 'ETH' },
    421614: { name: 'Arbitrum Sepolia', native: 'ETH' },
    11155420: { name: 'Optimism Sepolia', native: 'ETH' },
};

type ChainMetadata = {
    chainName: string;
    nativeCurrency: { name: string; symbol: string; decimals: number };
    rpcUrls: string[];
    blockExplorerUrls?: string[];
};

const CHAIN_METADATA: Record<number, ChainMetadata> = {
    1: {
        chainName: 'Ethereum Mainnet',
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
        rpcUrls: ['https://rpc.ankr.com/eth', 'https://mainnet.infura.io/v3/${INFURA_API_KEY}'],
        blockExplorerUrls: ['https://etherscan.io'],
    },
    10: {
        chainName: 'Optimism',
        nativeCurrency: { name: 'Optimism Ether', symbol: 'ETH', decimals: 18 },
        rpcUrls: ['https://mainnet.optimism.io'],
        blockExplorerUrls: ['https://optimistic.etherscan.io'],
    },
    56: {
        chainName: 'BNB Smart Chain',
        nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
        rpcUrls: ['https://bsc-dataseed.binance.org'],
        blockExplorerUrls: ['https://bscscan.com'],
    },
    137: {
        chainName: 'Polygon PoS',
        nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
        rpcUrls: ['https://polygon-rpc.com'],
        blockExplorerUrls: ['https://polygonscan.com'],
    },
    8453: {
        chainName: 'Base',
        nativeCurrency: { name: 'Base Ether', symbol: 'ETH', decimals: 18 },
        rpcUrls: ['https://mainnet.base.org'],
        blockExplorerUrls: ['https://basescan.org'],
    },
    42161: {
        chainName: 'Arbitrum One',
        nativeCurrency: { name: 'Arbitrum Ether', symbol: 'ETH', decimals: 18 },
        rpcUrls: ['https://arb1.arbitrum.io/rpc'],
        blockExplorerUrls: ['https://arbiscan.io'],
    },
    43114: {
        chainName: 'Avalanche C-Chain',
        nativeCurrency: { name: 'Avalanche', symbol: 'AVAX', decimals: 18 },
        rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
        blockExplorerUrls: ['https://snowtrace.io'],
    },
    534352: {
        chainName: 'Scroll',
        nativeCurrency: { name: 'Scroll Ether', symbol: 'ETH', decimals: 18 },
        rpcUrls: ['https://rpc.scroll.io'],
        blockExplorerUrls: ['https://scrollscan.com'],
    },
    11155111: {
        chainName: 'Ethereum Sepolia',
        nativeCurrency: { name: 'Sepolia ETH', symbol: 'ETH', decimals: 18 },
        rpcUrls: ['https://rpc.sepolia.org'],
        blockExplorerUrls: ['https://sepolia.etherscan.io'],
    },
    84532: {
        chainName: 'Base Sepolia',
        nativeCurrency: { name: 'Base Sepolia ETH', symbol: 'ETH', decimals: 18 },
        rpcUrls: ['https://sepolia.base.org'],
        blockExplorerUrls: ['https://sepolia.basescan.org'],
    },
    421614: {
        chainName: 'Arbitrum Sepolia',
        nativeCurrency: { name: 'Arbitrum Sepolia ETH', symbol: 'ETH', decimals: 18 },
        rpcUrls: ['https://sepolia-rollup.arbitrum.io/rpc'],
        blockExplorerUrls: ['https://sepolia.arbiscan.io'],
    },
    11155420: {
        chainName: 'Optimism Sepolia',
        nativeCurrency: { name: 'Optimism Sepolia ETH', symbol: 'ETH', decimals: 18 },
        rpcUrls: ['https://sepolia.optimism.io'],
        blockExplorerUrls: ['https://sepolia-optimism.etherscan.io'],
    },
};

type TestToken = {
    symbol: string;
    decimals: number;
    chains: number[];
};

export const TEST_TOKENS: Record<string, TestToken> = {
    // -----------------------------------------------------------------
    // Mainnet tokens
    // -----------------------------------------------------------------
    // Ethereum Mainnet
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2': {
        symbol: 'ETH',
        decimals: 18,
        chains: [1],
    },
    '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48': {
        symbol: 'USDC',
        decimals: 6,
        chains: [1],
    },
    '0xdAC17F958D2ee523a2206206994597C13D831ec7': {
        symbol: 'USDT',
        decimals: 6,
        chains: [1],
    },
    // Arbitrum One
    '0x82aF49447D8a07e3Bd95BD0d56f35241523fBab1': {
        symbol: 'ETH',
        decimals: 18,
        chains: [42161],
    },
    '0xaf88d065e77c8cC2239327C5EDb3A432268e5831': {
        symbol: 'USDC',
        decimals: 6,
        chains: [42161],
    },
    '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9': {
        symbol: 'USDT',
        decimals: 6,
        chains: [42161],
    },
    // Optimism Mainnet
    '0x4200000000000000000000000000000000000006': {
        symbol: 'ETH',
        decimals: 18,
        chains: [10, 8453], // shared address for Optimism-style L2s (Optimism & Base)
    },
    '0x7F5c764cBc14f9669B88837ca1490cCa17c31607': {
        symbol: 'USDC',
        decimals: 6,
        chains: [10],
    },
    '0x94b008aa00579c1307B0ef2c499aD98a8ce58e58': {
        symbol: 'USDT',
        decimals: 6,
        chains: [10],
    },
    // Base Mainnet
    '0x833589fCD6eDb6E08f4c7C32D4f61Bf633E9F8Cf': {
        symbol: 'USDC',
        decimals: 6,
        chains: [8453],
    },
    // Polygon PoS
    '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619': {
        symbol: 'ETH',
        decimals: 18,
        chains: [137],
    },
    '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174': {
        symbol: 'USDC',
        decimals: 6,
        chains: [137],
    },
    '0xc2132D05D31c914A87C6611C10748AaCB4Fe742d': {
        symbol: 'USDT',
        decimals: 6,
        chains: [137],
    },
    // BNB Smart Chain
    '0x2170Ed0880ac9A755fd29B2688956BD959F933F8': {
        symbol: 'ETH',
        decimals: 18,
        chains: [56],
    },
    '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d': {
        symbol: 'USDC',
        decimals: 18,
        chains: [56],
    },
    '0x55d398326f99059fF775485246999027B3197955': {
        symbol: 'USDT',
        decimals: 18,
        chains: [56],
    },
    // Avalanche C-Chain
    '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB': {
        symbol: 'ETH',
        decimals: 18,
        chains: [43114],
    },
    '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E': {
        symbol: 'USDC',
        decimals: 6,
        chains: [43114],
    },
    '0x9702230A8ea53601f5cd2dc00fdbcf13d4dF4A8c7': {
        symbol: 'USDT',
        decimals: 6,
        chains: [43114],
    },
    // Scroll Mainnet
    '0x5300000000000000000000000000000000000004': {
        symbol: 'ETH',
        decimals: 18,
        chains: [534352],
    },
    // -----------------------------------------------------------------
    // Testnet tokens (existing)
    // -----------------------------------------------------------------
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

function resolveTokenMetadata(token: string): TestToken | null {
    if (TEST_TOKENS[token]) return TEST_TOKENS[token];
    const bySymbol = Object.values(TEST_TOKENS).find(
        (meta) => meta.symbol.toLowerCase() === token.toLowerCase(),
    );
    return bySymbol ?? null;
}

function normalizeBridgeRequest(params: {
    fromChainId?: number;
    toChainId: number;
    token: string;
    amount: bigint;
    recipient?: string;
}) {
    const meta = resolveTokenMetadata(params.token);
    const symbol = meta?.symbol ?? params.token;
    const amountFormatted = meta
        ? ethers.formatUnits(params.amount, meta.decimals)
        : params.amount.toString();

    return {
        token: symbol,
        amount: amountFormatted,
        chainId: params.toChainId,
        sourceChains: params.fromChainId !== undefined ? [params.fromChainId] : undefined,
        recipient: params.recipient,
    };
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
let currentProvider: any | null = null;

function toHexChainId(chainId: number): `0x${string}` {
    return `0x${chainId.toString(16)}` as `0x${string}`;
}

export async function ensureWalletChain(provider: any, chainId: number) {
    if (!provider?.request) throw new Error('No compatible wallet provider found');

    const chainIdHex = toHexChainId(chainId);
    try {
        await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: chainIdHex }],
        });
    } catch (error: any) {
        const needsAdd =
            error?.code === 4902 ||
            (typeof error?.message === 'string' && /Unrecognized chain ID/i.test(error.message));

        if (!needsAdd) throw error;

        const metadata = CHAIN_METADATA[chainId];
        if (!metadata) throw error;

        await provider.request({
            method: 'wallet_addEthereumChain',
            params: [
                {
                    chainId: chainIdHex,
                    chainName: metadata.chainName,
                    nativeCurrency: metadata.nativeCurrency,
                    rpcUrls: metadata.rpcUrls,
                    blockExplorerUrls: metadata.blockExplorerUrls,
                },
            ],
        });

        await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: chainIdHex }],
        });
    }
}

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
    currentProvider = provider;
    const sdk = await getSdk();
    if (sdk.isInitialized()) return;
    await sdk.initialize(provider);
}

export async function deinit() {
    const sdk = await getSdk();
    if (!sdk.isInitialized()) return;
    await sdk.deinit();
    currentProvider = null;
}

export async function getUnifiedBalances(options: { includeSwappable?: boolean } = {}) {
    const sdk = await getSdk();
    const primaryFlag = options.includeSwappable ?? true;
    try {
        const balances = await sdk.getUnifiedBalances(primaryFlag);
        if (Array.isArray(balances)) return balances;
        if (balances && Array.isArray((balances as any).assets)) {
            return (balances as any).assets;
        }
        return [];
    } catch (error) {
        const message = error instanceof Error ? error.message : '';
        const isCurrenciesError = error instanceof TypeError && /currencies is not iterable/i.test(message);
        if (isCurrenciesError && primaryFlag !== false) {
            console.warn('[nexus] Unified balance fetch failed with swappable tokens, retrying without them');
            const fallback = await sdk.getUnifiedBalances(false);
            if (Array.isArray(fallback)) return fallback;
            if (fallback && Array.isArray((fallback as any).assets)) {
                return (fallback as any).assets;
            }
            return [];
        }
        if (isCurrenciesError) {
            console.warn('[nexus] Falling back to empty balances due to malformed SDK response', error);
            return [];
        }
        throw error;
    }
}

export async function transfer(params: {
    fromChainId: number;
    toChainId: number;
    token: string;
    amount: bigint;
    recipient?: string;
}) {
    if (currentProvider) {
        await ensureWalletChain(currentProvider, params.fromChainId);
    }
    const sdk = await getSdk();
    const request = normalizeBridgeRequest(params);
    if (request.recipient) {
        const result = await sdk.bridgeAndTransfer({
            token: request.token,
            amount: request.amount,
            chainId: request.chainId,
            recipient: request.recipient as `0x${string}`,
            sourceChains: request.sourceChains,
        });
        return result.transactionHash ?? result.explorerUrl ?? '';
    }
    const result = await sdk.bridge({
        token: request.token,
        amount: request.amount,
        chainId: request.chainId,
        sourceChains: request.sourceChains,
    });
    return result.explorerUrl;
}

export async function bridge(params: {
    fromChainId: number;
    toChainId: number;
    token: string;
    amount: bigint;
    recipient?: string;
}) {
    if (currentProvider) {
        await ensureWalletChain(currentProvider, params.fromChainId);
    }
    const sdk = await getSdk();
    const request = normalizeBridgeRequest(params);
    const result = await sdk.bridge({
        token: request.token,
        amount: request.amount,
        chainId: request.chainId,
        sourceChains: request.sourceChains,
        recipient: request.recipient as `0x${string}` | undefined,
    });
    return result.explorerUrl;
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