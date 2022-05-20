import { formatEther, parseEther } from "@ethersproject/units";
import pancakeFactoryAbi from "./abi/pancakeFactory";
import { pancakeRouterAddress, wBNB, BUSD, pancakeFactoryAddress } from "../constants/constants";
import { contractFactory } from "./index";

import { ChainId, Token, TokenAmount, Pair, TradeType, Trade, Route } from '@pancakeswap/sdk'

const factory = () =>
  contractFactory({
    abi: pancakeFacotryAbi,
    address: pancakeFactoryAddress,
  });

  