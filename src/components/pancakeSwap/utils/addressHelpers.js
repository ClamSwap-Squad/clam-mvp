import { ChainId } from "@pancakeswap/sdk";

import addresses from "../constants/contracts";

export const getAddress = (address) => {
  return address[ChainId.MAINNET];
};

export const getMulticallAddress = () => {
  return getAddress(addresses.multiCall);
};
