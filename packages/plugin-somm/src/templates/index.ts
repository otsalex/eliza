const vaultList = `
    Ethereum vaults and their addresses: {
        Turbo stETH - "0xfd6db5011b171B05E1Ea3b92f9EAcaEEb055e971"
        Real Yield ETH - "0xb5b29320d2Dde5BA5BAFA1EbcD270052070483ec"
        Real Yield BTC - "0x0274a704a6D9129F90A62dDC6f6024b33EcDad36"
        Real Yield USD - "0x97e6E0a40a3D02F12d1cEC30ebfbAE04e37C119E"
        Morpho ETH Maximizer - "0xcf4B531b4Cde95BD35d71926e09B2b54c564F5b6"
        Fraximal - "0xDBe19d1c3F21b1bB250ca7BDaE0687A97B5f77e6"
        ETH Trend Growth - "0x6b7f87279982d919Bbf85182DDeAB179B366D8f2"
        Real Yield LINK - "0x4068BDD217a45F8F668EF19F1E3A1f043e4c4934"
        Real Yield UNI - "0x6A6AF5393DC23D7e3dB28D28Ef422DB7c40932B6"
        DeFi Stars - "0x03df2A53Cbed19B824347D6a45d09016C2D1676a"
        Real Yield SNX - "0xcBf2250F33c4161e18D4A2FA47464520Af5216b5"
        Real Yield 1INCH - "0xC7b69E15D86C5c1581dacce3caCaF5b68cd6596F"
        Real Yield ENS - "0x18ea937aba6053bC232d9Ae2C42abE7a8a2Be440"
    }

    Arbitrum vaults and their addresses: {
        Real Yield ETH - "0xC47bB288178Ea40bF520a91826a3DEE9e0DbFA4C"
        Real Yield USD - "0x392B1E6905bb8449d26af701Cdea6Ff47bF6e5A8"
    }

    Optimism vaults and their addresses: {
        Real Yield ETH - "0xC47bB288178Ea40bF520a91826a3DEE9e0DbFA4C"
    }
`
export const vaultTvlTemplate = `Given the recent messages and wallet information below:

{{recentMessages}}

Extract the following information about the requested transfer:
- Chain where the vault exists("ethereum" or "arbitrum" or "optimism")
- Recipient address

${vaultList}

Extract the vault name from the most recent user message and pick the associated address.

Keep in mind that:
    User might shorten the "Real Yield" to "ry" names for example ryeth is Real Yield ETH!
    Chain names could also be shortened - arbitrum-arb, optimism-opt, ethereum-eth.
    Only extract the values from the latest message.

Also extract the chain from the message and respond with a JSON markdown block containing only the extracted values.
At last add the vault name as the vault, it should be one of the the vaults from above:

\`\`\`json
{
    "chain": "ethereum" | "arbitrum" | "optimism" | null,
    "address": string | null,
    "vault": string | null,
}
\`\`\`
`;


export const getBalanceTemplate = `Given the recent messages and wallet information below:

{{recentMessages}}

Extract the following information about the requested transfer:
- Chain where the vault exists("ethereum" or "arbitrum" or "optimism")
- Recipient address
- Users address

${vaultList}

1. Extract user's address that is associated with the balance.
2. Extract the vault name from the most recent user message and pick the associated address.
   Keep in mind that:
       User might shorten the "Real Yield" to "ry" names for example ryeth is Real Yield ETH!
       Chain names could also be shortened - arbitrum-arb, optimism-opt, ethereum-eth.
       Only extract the values from the latest message.

3. Also extract the chain from the message and respond with a JSON markdown block containing only the extracted values.
4. At last add the vault name as the vault, it should be one of the the vaults from above.

\`\`\`json
{
    "userAddress": string | null,
    "address": string | null,
    "chain": "ethereum" | "arbitrum" | "optimism" | null,
    "vault": string | null,
}
\`\`\`
`;
