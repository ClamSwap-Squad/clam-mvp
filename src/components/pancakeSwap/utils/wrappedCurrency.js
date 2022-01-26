import { ETHER, Token, WETH } from "@pancakeswap/sdk";

export function wrappedCurrency(currency, chainId) {
  return chainId && currency === ETHER
    ? WETH[chainId]
    : currency instanceof Token
    ? currency
    : undefined;
}
