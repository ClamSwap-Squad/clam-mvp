import { useMemo } from "react";

import { useActiveWeb3React } from "./useActiveWeb3React";
import { getContract, getProviderOrSigner } from "../utils";
import { getMulticallAddress } from "../utils/addressHelpers";

import ERC20_ABI from "../config/abi/erc20.json";
import ERC20_BYTES32_ABI from "../config/abi/erc20_bytes32.json";
import multiCallAbi from "../config/abi/Multicall.json";

function useContract(address, ABI, withSignerIfPossible = true) {
  const { library, account } = useActiveWeb3React();

  return useMemo(() => {
    if (!address || !ABI || !library) return null;
    try {
      return getContract(
        address,
        ABI,
        withSignerIfPossible ? getProviderOrSigner(library, account) : null
      );
    } catch (error) {
      console.error("Failed to get contract", error);
      return null;
    }
  }, [address, ABI, library, withSignerIfPossible, account]);
}

export function useTokenContract(tokenAddress, withSignerIfPossible) {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible);
}

export function useBytes32TokenContract(tokenAddress, withSignerIfPossible) {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible);
}

export function useMulticallContract() {
  return useContract(getMulticallAddress(), multiCallAbi, false);
}
