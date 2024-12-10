import {
    ActionExample,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    State,
    type Action,
} from "@ai16z/eliza";

export const totalTvlAction: Action = {
    name: "GET_TOTAL_TVL",
    similes: [],
    validate: async (_runtime: IAgentRuntime, _message: Memory) => {
        return true;
    },
    description:
        "Get Somm all vaults current TVL.",
    handler: async (
        _runtime: IAgentRuntime,
        _message: Memory,
        _state?: State,
        _options?: { [key: string]: unknown; },
        _callback?: HandlerCallback
    ): Promise<boolean> => {
        const response = await fetch("https://api.sommelier.finance/tvl", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          })

        if (response.status === 200) {
            const res = await response.json();
            const tvl = res.Response.total_tvl;


            const formatter = new Intl.NumberFormat('en-US', {
                notation: 'compact',
                maximumFractionDigits: 1
            });

            const formattedValue = formatter.format(tvl);
            await _callback({
                text: "Somm's total value locked: " + formattedValue
            });
        }
        return true;
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: { text: "What's the current TVL for Sommelier vaults?" },
            },
            {
                user: "{{user2}}",
                content: { action: "GET_STRATEGIES_TVL" },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "Can you check the total TVL for Somm?" },
            },
            {
                user: "{{user2}}",
                content: { action: "GET_STRATEGIES_TVL" },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "I'm curious about the total value locked in Sommelier vaults right now. Can you look that up?" },
            },
            {
                user: "{{user2}}",
                content: { action: "GET_STRATEGIES_TVL" },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "Hey, do you know the latest Sommelier TVL figures?" },
            },
            {
                user: "{{user2}}",
                content: {action: "GET_STRATEGIES_TVL" },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "What's the total TVL across all Sommelier strategies at the moment?" },
            },
            {
                user: "{{user2}}",
                content: { action: "GET_STRATEGIES_TVL" },
            },
        ]
    ] as ActionExample[][],
} as Action;
