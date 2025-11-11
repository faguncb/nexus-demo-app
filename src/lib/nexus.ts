import { ethers } from 'ethers';

// ... existing imports ...
// ---------------------------------------------------------------------
// Supported chains & token list (testnet)
// ---------------------------------------------------------------------
export const SUPPORTED_CHAINS = {
    1: { name: 'Ethereum Mainnet', native: 'ETH' },
    10: { name: 'Optimism', native: 'ETH' },
    8453: { name: 'Base Mainnet', native: 'ETH' },
    42161: { name: 'Arbitrum One', native: 'ETH' },
    137: { name: 'Polygon PoS', native: 'MATIC' },
    43114: { name: 'Avalanche C-Chain', native: 'AVAX' },
    534352: { name: 'Scroll', native: 'ETH' },
    11155111: { name: 'Sepolia', native: 'ETH' },
    84532: { name: 'Base Sepolia', native: 'ETH' },
    421614: { name: 'Arbitrum Sepolia', native: 'ETH' },
    11155420: { name: 'Optimism Sepolia', native: 'ETH' },
};

const MAINNET_CHAIN_IDS = new Set<number>([1, 10, 8453, 42161]);

export function isMainnetChain(chainId: number) {
    return MAINNET_CHAIN_IDS.has(chainId);
}

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

type UnifiedBalanceAsset = {
    symbol?: string;
    token?: string;
    name?: string;
    chainId?: number;
    chain?: { id?: number; name?: string };
    chainName?: string;
    balance?: string | number;
    formattedBalance?: string | number;
    amount?: string | number;
    value?: string | number;
    quantity?: string | number;
    balanceInFiat?: string | number;
    valueUSD?: string | number;
    usdValue?: string | number;
    [key: string]: any;
};

type NexusNetwork = 'testnet' | 'mainnet';

export const TEST_TOKENS: TestToken[] = [
    {
        symbol: 'ETH',
        decimals: 18,
        chains: [1, 10, 8453, 42161, 11155111, 84532, 421614, 11155420],
    },
    {
        symbol: 'USDC',
        decimals: 6,
        chains: [1, 10, 8453, 42161, 11155111, 84532, 421614, 11155420],
    },
    {
        symbol: 'USDT',
        decimals: 6,
        chains: [1, 10, 8453, 42161, 421614, 11155420],
    },
    {
        symbol: 'DAI',
        decimals: 18,
        chains: [84532],
    },
];

// ---------------------------------------------------------------------
// Get token address on a specific chain
// ---------------------------------------------------------------------
export function getTokenOnChain(symbol: string, chainId: number): TestToken | null {
    return (
        TEST_TOKENS.find(
            (meta) => meta.symbol.toLowerCase() === symbol.toLowerCase() && meta.chains.includes(chainId),
        ) ?? null
    );
}

function normalizeBridgeRequest(params: {
    fromChainId?: number;
    toChainId: number;
    token: string;
    amount: bigint;
    recipient?: string;
}) {
    const referenceChainId = params.fromChainId ?? params.toChainId;
    const meta = getTokenOnChain(params.token, referenceChainId);
    const amountFormatted = meta
        ? ethers.formatUnits(params.amount, meta.decimals)
        : params.amount.toString();

    return {
        token: params.token,
        amount: amountFormatted,
        chainId: params.toChainId,
        fromChainId: params.fromChainId,
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
let sdkNetwork: NexusNetwork = 'testnet';

function toHexChainId(chainId: number): `0x${string}` {
    return `0x${chainId.toString(16)}` as `0x${string}`;
}

function resolveNexusNetwork(chainId?: number): NexusNetwork {
    if (chainId !== undefined && MAINNET_CHAIN_IDS.has(chainId)) {
        return 'mainnet';
    }
    return 'testnet';
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

function sanitizeUnifiedBalances(assets: UnifiedBalanceAsset[]) {
    return assets.map((asset) => {
        const chainId =
            asset.chainId ??
            asset.chain?.id ??
            (typeof asset.chain === 'number' ? asset.chain : undefined) ??
            (asset.network?.chainId ?? asset.network?.id) ??
            asset.destinationChainId ??
            asset.sourceChainId;
        const chainMeta =
            chainId !== undefined && chainId !== null
                ? (SUPPORTED_CHAINS as Record<number, { name: string; native: string }>)[chainId]
                : undefined;
        const chainName =
            chainMeta?.name ??
            asset.chainName ??
            asset.chain?.name ??
            (chainId ? `Chain ${chainId}` : 'Unknown Chain');

        const nativeCurrency = chainMeta?.native ?? asset.nativeCurrency ?? asset.nativeSymbol;

        return {
            ...asset,
            chainId,
            chainName,
            nativeCurrency,
        };
    });
}

async function getSdk(network: NexusNetwork = sdkNetwork) {
    return getSdkForNetwork(network);
}

async function getSdkForNetwork(network: NexusNetwork) {
    if (!sdkPromise || sdkNetwork !== network) {
        ensurePolyfills();
        sdkNetwork = network;
        sdkPromise = import('@avail-project/nexus-core').then(({ NexusSDK }) => {
            sdkInstance = new NexusSDK({ network });
            return sdkInstance;
        });
    }
    return sdkPromise;
}

async function ensureSdkForChain(chainId: number) {
    const network = resolveNexusNetwork(chainId);
    const sdk = await getSdkForNetwork(network);
    if (!sdk.isInitialized()) {
        if (!currentProvider) throw new Error('Initialize SDK first');
        await sdk.initialize(currentProvider);
    }
    return sdk;
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
    let network = sdkNetwork;
    if (provider?.request) {
        try {
            const chainIdHex = await provider.request({ method: 'eth_chainId' });
            if (typeof chainIdHex === 'string') {
                const chainIdNum = Number(chainIdHex);
                if (!Number.isNaN(chainIdNum)) {
                    network = resolveNexusNetwork(chainIdNum);
                }
            }
        } catch (_) {
            // ignore provider introspection errors and fall back to existing network
        }
    }
    const sdk = await getSdk(network);
    if (sdk.isInitialized()) return;
    await sdk.initialize(provider);
}

export async function deinit() {
    if (sdkInstance?.isInitialized?.()) {
        await sdkInstance.deinit();
    }
    sdkInstance = null;
    sdkPromise = null;
    sdkNetwork = 'testnet';
    currentProvider = null;
}

export async function getUnifiedBalances(options: { includeSwappable?: boolean } = {}) {
    const sdk = await getSdk();
    if (!sdk.isInitialized()) throw new Error('Initialize SDK first');
    const primaryFlag = options.includeSwappable ?? true;
    const result = await sdk.getUnifiedBalances(primaryFlag);
    if (!result) return [];
    if (Array.isArray(result)) return sanitizeUnifiedBalances(result);
    if ((result as any).assets && Array.isArray((result as any).assets)) {
        return sanitizeUnifiedBalances((result as any).assets);
    }
    return [];
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
    if (!getTokenOnChain(params.token, params.toChainId)) {
        throw new Error(`Token ${params.token} is not available on destination chain ${params.toChainId}`);
    }
    const sdk = await ensureSdkForChain(params.fromChainId);
    const amountFormatted = ethers.formatUnits(
        params.amount,
        getTokenOnChain(params.token, params.fromChainId)?.decimals ?? 18,
    );
    const result = await sdk.transfer({
        token: params.token.toUpperCase(),
        amount: amountFormatted,
        chainId: params.toChainId,
        recipient: params.recipient as `0x${string}`,
        sourceChains: [params.fromChainId],
    });
    if (!result) throw new Error('Transfer failed: no response');
    if ((result as any).success === false) {
        throw new Error((result as any).error ?? 'Transfer failed');
    }
    return (
        (result as any).transactionHash ??
        (result as any).explorerUrl ??
        ''
    );
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
    if (!getTokenOnChain(params.token, params.fromChainId)) {
        throw new Error(`Token ${params.token} is not available on chain ${params.fromChainId}`);
    }
    const sdk = await ensureSdkForChain(params.fromChainId);
    const request = normalizeBridgeRequest(params);
    const result = await sdk.bridge({
        token: request.token,
        amount: request.amount,
        chainId: request.chainId,
        sourceChains: request.sourceChains,
        recipient: request.recipient as `0x${string}` | undefined,
    });
    if (!result) throw new Error('Bridge failed: no response');
    if ((result as any).success === false) {
        throw new Error((result as any).error ?? 'Bridge failed');
    }
    const explorerUrl = (result as any).explorerUrl ?? '';
    const transactionHash = (result as any).transactionHash ?? '';
    if (!explorerUrl && !transactionHash) {
        throw new Error('Bridge succeeded but returned no explorer URL or transaction hash');
    }
    return transactionHash || explorerUrl;
}

// ---------------------------------------------------------------------
// NEW: Hook registration (call once after init)
// ---------------------------------------------------------------------
export async function registerApprovalHooks(provider: any) {
    const sdk = await getSdk();
    if (!sdk.isInitialized()) {
        await sdk.initialize(provider);
    }
    const ethersProvider = new ethers.BrowserProvider(provider);
    const signer = await ethersProvider.getSigner();

    // ---- Intent hook ---------------------------------------------------
    sdk.setOnIntentHook(async (intent: any) => {
        // 1. Show the user what will happen
        const msg = `
You are about to submit a cross-chain intent:

From: ${intent.fromChainId} → To: ${intent.toChainId}
Token: ${intent.token}   Amount: ${intent.amount}
    `.trim();

        if (!confirm(msg)) throw new Error('User rejected intent');

        // 2. Ask for a typed-data signature (EIP-712)
        const networkInfo = await signer.provider?.getNetwork();
        const chainId = networkInfo?.chainId !== undefined ? Number(networkInfo.chainId) : 0;
        const domain = {
            name: 'Avail Nexus',
            version: '1',
            chainId: Number.isNaN(chainId) ? 0 : chainId,
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
    sdk.setOnAllowanceHook(async (allowance: any) => {
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