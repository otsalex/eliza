import {
    ActionExample,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    State,
    type Action, composeContext, generateObject, ModelClass, elizaLogger,
} from "@ai16z/eliza";
import { createPublicClient, http, parseAbi } from 'viem'
import { mainnet, arbitrum, optimism } from 'viem/chains'

import { getBalanceTemplate } from "../templates";
export { getBalanceTemplate };

export const userBalanceAction: Action = {
    name: "GET_USER_BALANCE",
    similes: ["GET_USER_BALANCE_IN_VAULT"],
    validate: async (_runtime: IAgentRuntime, _message: Memory) => {
        return true;
    },
    description:
        "Get user's balance in vault.",
    handler: async (
        runtime: IAgentRuntime,
        _message: Memory,
        state?: State,
        _options?: { [key: string]: unknown; },
        callback?: HandlerCallback
    ): Promise<boolean> => {

        const context = composeContext({
            state,
            template: getBalanceTemplate,
        });

        const content = await generateObject({
            runtime,
            context: context,
            modelClass: ModelClass.MEDIUM,
        });

        const user = content.userAddress;
        const chain = content.chain;
        const address = content.address;

        if (!content.address) {
            await callback({
                text: "Couldn't fetch the balance"
            });
            return false;
        }

        const chainConfig = {
            'ethereum': mainnet,
            'arbitrum': arbitrum,
            'optimism': optimism
        }[chain.toLowerCase()];

        if (!chainConfig) {
            await callback({
                text: `Unsupported chain: ${chain}`
            });
            return false;
        }

        const client = createPublicClient({
            chain: chainConfig,
            transport: http()
        });

        const abi = parseAbi([
            'function balanceOf(address owner) view returns (uint256)'
        ]);

        try {
            const balance = await client.readContract({
                address: address as `0x${string}`,
                abi: abi,
                functionName: 'balanceOf',
                args: [user as `0x${string}`]
            });

            const decimals = await client.readContract({
                address: address as `0x${string}`,
                abi: parseAbi(['function decimals() view returns (uint8)']),
                functionName: 'decimals'
            });

            const formattedBalance = Number(balance) / (10 ** Number(decimals));

            await callback({
                text: `Your balance on ${content.vault} on ${chain} is ${formattedBalance.toFixed(4)}`
            });

            return true;
        } catch (error) {
            elizaLogger.error("Balance fetch error:", error);
            await callback({
                text: `Failed to fetch balance: ${error instanceof Error ? error.message : 'Unknown error'}`
            });
            return false;
        }
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: { text: "What's my balance of Real Yield ETH on Ethereum? My address is 0x1234A" },
            },
            {
                user: "{{user2}}",
                content: { action: "GET_USER_BALANCE" },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "My address is 0x1234A. What's my balance of ryeth on arb?" },
            },
            {
                user: "{{user2}}",
                content: { action: "GET_USER_BALANCE" },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "How much do I have on Real Yield USD on eth? Address: 0x1234A" },
            },
            {
                user: "{{user2}}",
                content: { action: "GET_USER_BALANCE" },
            },
        ]
    ] as ActionExample[][],
} as Action;
