import { StaticJsonRpcProvider } from "@ethersproject/providers";

const RPC_URL = "https://nodes.pancakeswap.com";

export const simpleRpcProvider = new StaticJsonRpcProvider(RPC_URL);
