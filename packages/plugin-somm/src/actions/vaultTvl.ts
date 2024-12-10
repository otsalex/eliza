import {
    ActionExample,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    State,
    type Action, composeContext, generateObject, ModelClass, elizaLogger,
} from "@ai16z/eliza";

import { vaultTvlTemplate } from "../templates";
export { vaultTvlTemplate };

export const vaultTvlAction: Action = {
    name: "GET_VAULT_TVL",
    similes: ["GET_CELLAR_TVL"],
    validate: async (_runtime: IAgentRuntime, _message: Memory) => {
        return true;
    },
    description:
        "Get specific vault's current TVL.",
    template: vaultTvlTemplate,
    handler: async (
        runtime: IAgentRuntime,
        _message: Memory,
        state?: State,
        _options?: { [key: string]: unknown; },
        callback?: HandlerCallback
    ): Promise<boolean> => {

        const context = composeContext({
            state,
            template: vaultTvlTemplate,
        });

        const content = await generateObject({
            runtime,
            context: context,
            modelClass: ModelClass.MEDIUM,
        });


        elizaLogger.debug("cellarTvlAction content:", content);
        console.log(content);

        const response = await fetch("https://api.sommelier.finance/tvl", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })

        if (response.status === 200) {
            if (!content.address) {
                await callback({
                    text: "Couldn't fetch the TVL data"
                });
                return false;
            }
            let address = content.address;

            if (content.chain === "optimism") address += "-optimism";
            if (content.chain === "arbitrum") address += "-arbitrum";

            const res = await response.json();
            const tvl = res.Response[address];


            const formatter = new Intl.NumberFormat('en-US', {
                notation: 'compact',
                maximumFractionDigits: 1
            });

            const formattedValue = formatter.format(tvl);

            await callback({
                text: "TVL for " + address + " on " + content.chain + " is " + formattedValue
            });
            return true;
        }
        return false;
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: { text: "What's the current TVL for Real Yield ETH on Ethereum?" },
            },
            {
                user: "{{user2}}",
                content: { action: "GET_VAULT_TVL" },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "Can you check the Total Value Locked for Turbo stETH vault on Ethereum?" },
            },
            {
                user: "{{user2}}",
                content: { action: "GET_VAULT_TVL" },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "What's the TVL of Real Yield BTC vault on Ethereum right now?" },
            },
            {
                user: "{{user2}}",
                content: { action: "GET_VAULT_TVL" },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "How much is locked in the RYUSD vault on Arbitrum?" },
            },
            {
                user: "{{user2}}",
                content: { action: "GET_VAULT_TVL" },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "What's the tvl for Real Yield ETH on Arbitrum?" },
            },
            {
                user: "{{user2}}",
                content: { action: "GET_VAULT_TVL" },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "Can you tell me the TVL for Morpho ETH Maximizer vault on Ethereum?" },
            },
            {
                user: "{{user2}}",
                content: { action: "GET_VAULT_TVL" },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "What is the current TVL for Real Yield LINK on Ethereum?" },
            },
            {
                user: "{{user2}}",
                content: { action: "GET_VAULT_TVL" },
            },
        ]
    ] as ActionExample[][],
} as Action;
