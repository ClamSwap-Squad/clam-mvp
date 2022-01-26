import { useMemo } from "react";
import { Currency, ETHER, Token, currencyEquals } from "@pancakeswap/sdk";
import { parseBytes32String } from "@ethersproject/strings";
import { arrayify } from "@ethersproject/bytes";

import { useActiveWeb3React } from "./useActiveWeb3React";
import { isAddress } from "../utils";
import { useCombinedActiveList } from "./list";
import { useTokenContract, useBytes32TokenContract } from "./useContract";
import { NEVER_RELOAD } from "../constants";
import { useSingleCallResult } from "./multicallHook";

// reduce token map into standard address <-> Token mapping, optionally include user added tokens
function useTokensFromMap(tokenMap, includeUserAdded) {
  const { chainId } = useActiveWeb3React();
  const userAddedTokens = [];

  return useMemo(() => {
    if (!chainId) return {};

    // reduce to just tokens
    const mapWithoutUrls = Object.keys(tokenMap[chainId]).reduce((newMap, address) => {
      newMap[address] = tokenMap[chainId][address].token;
      return newMap;
    }, {});

    if (includeUserAdded) {
      return (
        userAddedTokens
          // reduce into all ALL_TOKENS filtered by the current chain
          .reduce(
            (tokenMap_, token) => {
              tokenMap_[token.address] = token;
              return tokenMap_;
            },
            // must make a copy because reduce modifies the map, and we do not
            // want to make a copy in every iteration
            { ...mapWithoutUrls }
          )
      );
    }

    return mapWithoutUrls;
  }, [chainId, userAddedTokens, tokenMap, includeUserAdded]);
}

export function useAllTokens() {
  const allTokens = useCombinedActiveList();
  return useTokensFromMap(allTokens, true);
}

// parse a name or symbol from a token response
const BYTES32_REGEX = /^0x[a-fA-F0-9]{64}$/;

function parseStringOrBytes32(str, bytes32, defaultValue) {
  return str && str.length > 0
    ? str
    : // need to check for proper bytes string and valid terminator
    bytes32 && BYTES32_REGEX.test(bytes32) && arrayify(bytes32)[31] === 0
    ? parseBytes32String(bytes32)
    : defaultValue;
}

export function useToken(tokenAddress) {
  const { chainId } = useActiveWeb3React();
  const tokens = useAllTokens();

  const address = isAddress(tokenAddress);

  const tokenContract = useTokenContract(address || undefined, false);
  const tokenContractBytes32 = useBytes32TokenContract(address || undefined, false);
  const token = address ? tokens[address] : undefined;

  const tokenName = useSingleCallResult(
    token ? undefined : tokenContract,
    "name",
    undefined,
    NEVER_RELOAD
  );
  const tokenNameBytes32 = useSingleCallResult(
    token ? undefined : tokenContractBytes32,
    "name",
    undefined,
    NEVER_RELOAD
  );
  const symbol = useSingleCallResult(
    token ? undefined : tokenContract,
    "symbol",
    undefined,
    NEVER_RELOAD
  );
  const symbolBytes32 = useSingleCallResult(
    token ? undefined : tokenContractBytes32,
    "symbol",
    undefined,
    NEVER_RELOAD
  );
  const decimals = useSingleCallResult(
    token ? undefined : tokenContract,
    "decimals",
    undefined,
    NEVER_RELOAD
  );

  return useMemo(() => {
    if (token) return token;
    if (!chainId || !address) return undefined;
    if (decimals.loading || symbol.loading || tokenName.loading) return null;
    if (decimals.result) {
      return new Token(
        chainId,
        address,
        decimals.result[0],
        parseStringOrBytes32(symbol.result?.[0], symbolBytes32.result?.[0], "UNKNOWN"),
        parseStringOrBytes32(tokenName.result?.[0], tokenNameBytes32.result?.[0], "Unknown Token")
      );
    }
    return undefined;
  }, [
    address,
    chainId,
    decimals.loading,
    decimals.result,
    symbol.loading,
    symbol.result,
    symbolBytes32.result,
    token,
    tokenName.loading,
    tokenName.result,
    tokenNameBytes32.result,
  ]);
}

export function useCurrency(currencyId) {
  const isBNB = currencyId?.toUpperCase() === "BNB";
  const token = useToken(isBNB ? undefined : currencyId);
  return isBNB ? ETHER : token;
}
