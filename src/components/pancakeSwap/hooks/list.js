import { ChainId, Token } from "@pancakeswap/sdk";

import { DEFAULT_TOKEN_LIST } from "../constants/defaultTokenList";

/**
 * Token instances created from token info.
 */
export class WrappedTokenInfo extends Token {
  constructor(tokenInfo, tags) {
    super(
      tokenInfo.chainId,
      tokenInfo.address,
      tokenInfo.decimals,
      tokenInfo.symbol,
      tokenInfo.name
    );
    this.tokenInfo = tokenInfo;
    this.tags = tags;
  }

  get logoURI() {
    return this.tokenInfo.logoURI;
  }
}

/**
 * An empty result, useful as a default.
 */
const EMPTY_LIST = {
  [ChainId.MAINNET]: {},
  [ChainId.TESTNET]: {},
};

export function listToTokenMap(list) {
  const map = list.reduce(
    (tokenMap, tokenInfo) => {
      const tags =
        tokenInfo.tags
          ?.map((tagId) => {
            if (!list.tags?.[tagId]) return undefined;
            return { ...list.tags[tagId], id: tagId };
          })
          ?.filter((x) => Boolean(x)) ?? [];
      const token = new WrappedTokenInfo(tokenInfo, tags);
      if (tokenMap[token.chainId][token.address] !== undefined) throw Error("Duplicate tokens.");
      return {
        ...tokenMap,
        [token.chainId]: {
          ...tokenMap[token.chainId],
          [token.address]: {
            token,
            list,
          },
        },
      };
    },
    { ...EMPTY_LIST }
  );

  return map;
}

export function useCombinedActiveList() {
  return listToTokenMap(DEFAULT_TOKEN_LIST);
}
