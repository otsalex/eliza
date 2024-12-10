import { Plugin } from "@ai16z/eliza";
import { userBalanceAction, vaultTvlAction, totalTvlAction } from "./actions";

import { dataProvider } from "./providers";

export * from "./actions/totalTvl";
export * from "./actions/vaultTvl";

export const sommPlugin: Plugin = {
    name: "somm",
    description: "Provides Somm specific stuff",
    actions: [ totalTvlAction, vaultTvlAction, userBalanceAction ],
    evaluators: [],
    providers: [],
};
