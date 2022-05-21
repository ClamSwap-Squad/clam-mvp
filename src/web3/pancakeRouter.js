import { formatEther, parseEther } from "@ethersproject/units";
import pancakeRouterAbi from "./abi/PancakeRouter.json";
import { pancakeRouterAddress, wBNB, BUSD } from "../constants/constants";
import { contractFactory } from "./index";
import { getLPTokens, getReserves } from "./pancakePair";
import BigNumber from "bignumber.js";
import { getAccount } from "./shared";
import { Currency, CurrencyAmount } from '@pancakeswap/sdk'
import { ChainId, Token, TokenAmount, Pair, TradeType, Trade, Route, ETHER, WETH } from '@pancakeswap/sdk'
import { useMemo } from 'react'
import flatMap from 'lodash/flatMap'
import { Interface } from '@ethersproject/abi'
import IPancakePairABI from './abi/IPancakePair.json'

const PAIR_INTERFACE = new Interface(IPancakePairABI)

const router = () =>
  contractFactory({
    abi: pancakeRouterAbi,
    address: pancakeRouterAddress,
  });

  
const eventCallback = async (res) => {
  try {
    console.log("Success", { res }); // add a toaster here

    return res;
  } catch (error) {
    console.error(error); // add toaster to show error

    return error;
  }
};

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

export const getTokenAmountFromOtherToken = async (amountIn, iTokenAddress, oTokenAddress) => {
  if( amountIn > 0 && iTokenAddress && oTokenAddress ) {
    
    try {
      
      const path = [iTokenAddress, oTokenAddress];
      const result = await getAmountsOut(parseEther(amountIn), path);
      const price = result[result.length - 1];
      console.log('aaaaaaaaaaa price', formatEther(price));
      return formatEther(price);
      
    } catch (error) {

      const path = [iTokenAddress, wBNB, oTokenAddress];
      const result = await getAmountsOut(parseEther(amountIn), path);
      const price = result[result.length - 1];
      console.log('ddddddddddd price', formatEther(price));

      return formatEther(price);
      
    }

  }

  return 0;
}

export const getUsdPriceOfToken = async (tokenAddress, baseCurrency = "BNB") => {
  const base = getBaseCurrency(baseCurrency);
  const path = tokenAddress === base ? [tokenAddress, BUSD] : [tokenAddress, base, BUSD];
  // console.log(path);
  const result = await getAmountsOut(parseEther("1"), path);
  const price = result[result.length - 1];

  return formatEther(price);
};

export function wrappedCurrency(currency, chainId) {
  return chainId && currency === ETHER ? WETH[chainId] : currency instanceof Token ? currency : undefined
}


export const testnetTokens = [
  new Token(
    97,
    '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
    18,
    'WBNB',
    'Wrapped BNB',
    'https://www.binance.com/',
  ),
  new Token(
    97,
    '0xa35062141Fa33BCA92Ce69FeD37D0E8908868AAe',
    18,
    'CAKE',
    'PancakeSwap Token',
    'https://pancakeswap.finance/',
  ),
  new Token(
    97,
    '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee',
    18,
    'BUSD',
    'Binance USD',
    'https://www.paxos.com/busd/',
  ),
  new Token(
    97,
    '0xfE1e507CeB712BDe086f3579d2c03248b2dB77f9',
    18,
    'SYRUP',
    'SyrupBar Token',
    'https://pancakeswap.finance/',
  ),
  new Token(
    97,
    '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
    18,
    'BAKE',
    'Bakeryswap Token',
    'https://www.bakeryswap.org/',
  ),
]


const useAllCommonPairs = (currencyA, currencyB) => {
  const chainId = 97;
  const [tokenA, tokenB] = chainId
    ? [wrappedCurrency(currencyA, chainId), wrappedCurrency(currencyB, chainId)]
    : [undefined, undefined];

  const common = testnetTokens;
  const additionalA = tokenA.address;
  const additionalB = tokenB.address

  const bases = [...common,];
  const basePairs = flatMap(bases, (base) => bases.map((otherBase) => [base, otherBase]))
  
  const allPairCombinations = [
    // the direct pair
    [tokenA, tokenB],
    // token A against all bases
    ...bases.map((base) => [tokenA, base]),
    // token B against all bases
    ...bases.map((base) => [tokenB, base]),
    // each base against all bases
    ...basePairs,
  ]
  .filter((tokens) => Boolean(tokens[0] && tokens[1]))
  .filter(([t0, t1]) => t0.address !== t1.address)
  .filter(([tokenA_, tokenB_]) => {
    if (!chainId) return true
    const customBases = {};

    const customBasesA = customBases?.[tokenA_.address]
    const customBasesB = customBases?.[tokenB_.address]

    if (!customBasesA && !customBasesB) return true

    if (customBasesA && !customBasesA.find((base) => tokenB_.equals(base))) return false
    if (customBasesB && !customBasesB.find((base) => tokenA_.equals(base))) return false

    return true
  });

  const tokens = allPairCombinations.map(([currencyA, currencyB]) => [
    wrappedCurrency(currencyA, chainId),
    wrappedCurrency(currencyB, chainId),
  ]);

  const allPairs = usePairs(allPairCombinations)
  console.log(allPairs, "ALL PAIRS(((((");

  // return Object.values(
  //   allPairs
  //     // filter out invalid pairs
  //     .filter((result) => Boolean(result[0] === PairState.EXISTS && result[1]))
  //     // filter out duplicated pairs
  //     .reduce((memo, [, curr]) => {
  //       memo[curr.liquidityToken.address] = memo[curr.liquidityToken.address] ?? curr
  //       return memo
  //     }, {}),
  // )
}

function usePairs(currencies) {
  const chainId = 97;

  const tokens = currencies.map(([currencyA, currencyB]) => [
    wrappedCurrency(currencyA, chainId),
    wrappedCurrency(currencyB, chainId),
  ])

  const pairAddresses = tokens.map(([tokenA, tokenB]) => {
    try {
      return tokenA && tokenB && !tokenA.equals(tokenB) ? Pair.getAddress(tokenA, tokenB) : undefined
    } catch (error) {
      // Debug Invariant failed related to this line
      console.error(
        error.msg,
        `- pairAddresses: ${tokenA?.address}-${tokenB?.address}`,
        `chainId: ${tokenA?.chainId}`,
      )

      return undefined
    }
  });

  console.log('pairAddresses usePairs', pairAddresses);

  const results = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'getReserves')

  return results.map((result, i) => {
    const { result: reserves, loading } = result
    const tokenA = tokens[i][0]
    const tokenB = tokens[i][1]

    if (loading) return [PairState.LOADING, null]
    if (!tokenA || !tokenB || tokenA.equals(tokenB)) return [PairState.INVALID, null]
    if (!reserves) return [PairState.NOT_EXISTS, null]
    const { reserve0, reserve1 } = reserves
    const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
    return [
      PairState.EXISTS,
      new Pair(new TokenAmount(token0, reserve0.toString()), new TokenAmount(token1, reserve1.toString())),
    ]
  })
}


function useMultipleContractSingleData(
  addresses,
  contractInterface,
  methodName,
  callInputs,
  options,
) {
  const fragment = contractInterface.getFunction(methodName);
  const callData = fragment && isValidMethodArgs(callInputs)
        ? contractInterface.encodeFunctionData(fragment, callInputs)
        : undefined;

  const calls = fragment && addresses && addresses.length > 0 && callData
        ? addresses.map((address) => {
            return address && callData
              ? {
                  address,
                  callData,
                }
              : undefined
          })
        : [];

  const results = useCallsData(calls, options)

  const { cache } = useSWRConfig()

  const currentBlockNumber = cache.get('blockNumber')
  return results.map((result) => toCallState(result, contractInterface, fragment, currentBlockNumber));
}


function isValidMethodArgs(x) {
  return (
    x === undefined ||
    (Array.isArray(x) && x.every((xi) => isMethodArg(xi) || (Array.isArray(xi) && xi.every(isMethodArg))))
  )
}


export const swap = async (iToken, oToken, iAmount, oAmount, slippage, _deadline ) => {
  console.log("swap", iToken, oToken, iAmount);
  const account = getAccount();

  let path;
  const deadline = Math.floor(Date.now() / 1000) + 60 * _deadline // 20 minutes from the current Unix time

  try {
      
    path = [iToken.address, oToken.address];
    const result = await getAmountsOut(parseEther(iAmount), path);
    const price = result[result.length - 1];
    console.log('aaaaaaaaaaa price', formatEther(price));

    
  } catch (error) {

    path = [iToken.address, wBNB, oToken.address];
    const result = await getAmountsOut(parseEther(iAmount), path);
    const price = result[result.length - 1];
    console.log('ddddddddddd price', formatEther(price));
    
  }

    
  console.log('path', path);

  // const amountOutMin = parseEther( (oAmount * (100 - slippage)).toString() ) ;
  const amountOutMin = parseEther(oAmount);
  console.log(parseEther(oAmount));
  console.log(amountOutMin);

  const _iToken = new Token(iToken.chainId, iToken.address, iToken.decimals, iToken.symbol, iToken.name);
  console.log('swap in router _iToken', _iToken);

  const _oTOken = new Token(iToken.chainId, oToken.address, oToken.decimals, oToken.symbol, oToken.name)
  console.log('swap in router _oTOken', _oTOken);

  const _pair = new Pair(new TokenAmount(_iToken, parseEther(iAmount) ), new TokenAmount(_oTOken, parseEther(oAmount)))
  console.log('swap in router _pair', _pair);

  const _route = new Route([_pair], _iToken)
  console.log('swap in router _route', _route);

  const trade = new Trade(_route, new TokenAmount(_iToken, parseEther(iAmount)), TradeType.EXACT_INPUT);
  console.log('swap in router trade', trade);

  // const allowedPairs = useAllCommonPairs(_iToken, _oTOken)
  // console.log(allowedPairs, "Allowed Pairs");  

  // const dafasd = Trade.bestTradeExactIn(allowedPairs, parseEther(iAmount), _oTOken, { maxHops: 1, maxNumResults: 1 })[0] ?? null;  



  if(iToken.address == wBNB) {
    console.log("swapExactETHForTokens");
    await router().methods
      .swapExactETHForTokens( amountOutMin, path, account, deadline )
      .send({
        from: account,
        value: parseEther(iAmount) 
      })
      .once("", eventCallback);
  }
  else if (oToken.address == wBNB) {
    console.log("swapExactTokensForETH");

    await router().methods
      .swapExactTokensForETH( parseEther(iAmount), amountOutMin, path, account, deadline )
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
      .swapExactTokensForTokens( parseEther(iAmount), amountOutMin, path, account, deadline )
      .send({
        from: account
      }).then( async (receipt) => {
        console.log(receipt);
        return "Success";

      }).catch((err) => {
        console.log(err);
        return "false";
      });
  }
};

const getAmountsOut = async (amount, path) => {
  return await router().methods.getAmountsOut(amount, path).call();
};