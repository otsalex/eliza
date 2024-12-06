import { Plugin } from "@ai16z/eliza";
import { tvlAction } from "./actions";

export * as actions from "./actions";

export const sommPlugin: Plugin = {
    name: "somm",
    description: "Provides Somm specific stuff",
    actions: [ tvlAction ],
    evaluators: [],
    providers: [],
};
