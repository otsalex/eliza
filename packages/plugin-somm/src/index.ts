import { Plugin } from "@ai16z/eliza";
import { tvlAction } from "./actions";
import { dataProvider } from "./providers";

export * as actions from "./actions";

export const sommPlugin: Plugin = {
    name: "somm",
    description: "Provides Somm specific stuff",
    actions: [ tvlAction ],
    evaluators: [],
    providers: [ dataProvider ],
};
