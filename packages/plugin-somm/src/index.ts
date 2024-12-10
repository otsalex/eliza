import { Plugin } from "@ai16z/eliza";
import { vaultTvlAction } from "./actions";
import { totalTvlAction } from "./actions";
import { dataProvider } from "./providers";

export * from "./actions/totalTvl";
export * from "./actions/vaultTvl";

export const sommPlugin: Plugin = {
    name: "somm",
    description: "Provides Somm specific stuff",
    actions: [ totalTvlAction, vaultTvlAction ],
    evaluators: [],
    providers: [],
};
