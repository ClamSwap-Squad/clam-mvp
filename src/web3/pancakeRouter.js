import { formatEther, parseEther } from "@ethersproject/units";
import pancakeRouterAbi from "./abi/PancakeRouter.json";
import { pancakeRouterAddress, wBNB, BUSD } from "../constants/constants";
import { contractFactory } from "./index";
import { getLPTokens, getReserves } from "./pancakePair";
import BigNumber from "bignumber.js";
import { getAccount, MaxUint256 } from "./shared";


import { ChainId, Token, TokenAmount, Pair, TradeType, Route, Percent, Trade } from '@pancakeswap/sdk'

const router = () =>
  contractFactory({
    abi: pancakeRouterAbi,
    address: pancakeRouterAddress,
  });

const getBaseCurrency = (token) => {
  switch (token) {
    // add more possible base currencies here, like eth
    default:
      return wBNB;
  }
};

export const getUsdValueOfPair = async (lpToken) => {
  const { 0: t0Supply, 1: t1Supply } = await getReserves(lpToken);
  const [token0, token1] = await getLPTokens(lpToken);
  const [t0Price, t1Price] = await Promise.all([
    getUsdPriceOfToken(token0),
    getUsdPriceOfToken(token1),
  ]);

  const p0 = new BigNumber(formatEther(t0Supply)).multipliedBy(t0Price);
  const p1 = new BigNumber(formatEther(t1Supply)).multipliedBy(t1Price);

  return p0.plus(p1).toString();
};

export const getQuote = async (amountA, reserveA, reserveB) => {
  if( amountA > 0 && reserveA && reserveB ) {
    const amountB = await router().methods.quote(parseEther(amountA), reserveA, reserveB).call();
    return formatEther(amountB);
  }
  return 0;
};

export const getUsdPriceOfToken = async (tokenAddress, baseCurrency = "BNB") => {
  const base = getBaseCurrency(baseCurrency);
  const path = tokenAddress === base ? [tokenAddress, BUSD] : [tokenAddress, base, BUSD];
  const result = await getAmountsOut(parseEther("1"), path);
  const price = result[result.length - 1];

  return formatEther(price);
};

export const swap = async (iToken, oToken, iAmount, oAmount ) => {
  console.log("swap", iToken, oToken, iAmount);
  const account = getAccount();

  const path = [iToken.address, oToken.address]
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20 // 20 minutes from the current Unix time

  if(iToken.address == wBNB) {
    console.log("swapExactETHForTokens");
    await router().methods
      .swapExactETHForTokens( parseEther(oAmount), path, account, deadline )
      .send({
        from: account,
        value: parseEther(iAmount) 
      }).then( async (receipt) => {
        return "Success";

      }).catch((err) => {
        return "false";
      });
  }
  else if (oToken.address == wBNB) {
    console.log("swapExactTokensForETH");
    await router().methods
      .swapExactTokensForETH( parseEther(iAmount), parseEther(oAmount), path, account, deadline )
      .send({
        from: account
      }).then( async (receipt) => {
        return "Success";

      }).catch((err) => {
        return "false";
      });
  } else {
    console.log("swapExactTokensForTokens");
    await router().methods
      .swapExactTokensForTokens( parseEther(iAmount), parseEther(oAmount), path, account, deadline )
      .send({
        from: account
      }).then( async (receipt) => {
        return "Success";

      }).catch((err) => {
        return "false";
      });
  }
}

const getAmountsOut = async (amount, path) => {
  return await router().methods.getAmountsOut(amount, path).call();
};
