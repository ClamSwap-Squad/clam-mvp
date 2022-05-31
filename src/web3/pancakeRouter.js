import { formatEther, parseEther } from "@ethersproject/units";
import pancakeRouterAbi from "./abi/PancakeRouter.json";
import { pancakeRouterAddress, wBNB, BUSD } from "../constants/constants";
import { contractFactory } from "./index";
import { getLPTokens, getReserves } from "./pancakePair";
import BigNumber from "bignumber.js";
import { getAccount } from "./shared";
import { Currency, CurrencyAmount } from '@pancakeswap/sdk'
import { ChainId, Token, TokenAmount, Pair, TradeType, Trade, Route, ETHER, WETH, Percent, JSBI } from '@pancakeswap/sdk'
import { useMemo } from 'react'
import flatMap from 'lodash/flatMap'
import { Interface } from '@ethersproject/abi'
import IPancakePairABI from './abi/IPancakePair.json'
import BN from "bn.js";

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

const getAmountsOut = async (amount, path) => {
  return await router().methods.getAmountsOut(amount, path).call();
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
      // console.log('aaaaaaaaaaa price', formatEther(price));
      return formatEther(price);
      
    } catch (error) {

      const path = [iTokenAddress, wBNB, oTokenAddress];
      const result = await getAmountsOut(parseEther(amountIn), path);
      const price = result[result.length - 1];
      // console.log('ddddddddddd price', formatEther(price));

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
  // const results = [];

  // const { cache } = useSWRConfig()

  // const currentBlockNumber = cache.get('blockNumber')
  // return results.map((result) => toCallState(result, contractInterface, fragment, currentBlockNumber));
}

// the lowest level call for subscribing to contract data
function useCallsData(calls, options) {
  const chainId = 97;
  // const callResults = useSelector((state) => state.multicall.callResults);
  

  console.log('callResults', callResults)

  // const dispatch = useDispatch<AppDispatch>()

  // const serializedCallKeys: string = useMemo(
  //   () =>
  //     JSON.stringify(
  //       calls
  //         ?.filter((c): c is Call => Boolean(c))
  //         ?.map(toCallKey)
  //         ?.sort() ?? [],
  //     ),
  //   [calls],
  // )

  // // update listeners when there is an actual change that persists for at least 100ms
  // useEffect(() => {
  //   const callKeys: string[] = JSON.parse(serializedCallKeys)
  //   if (!chainId || callKeys.length === 0) return undefined
  //   // eslint-disable-next-line @typescript-eslint/no-shadow
  //   const calls = callKeys.map((key) => parseCallKey(key))
  //   dispatch(
  //     addMulticallListeners({
  //       chainId,
  //       calls,
  //       options,
  //     }),
  //   )

  //   return () => {
  //     dispatch(
  //       removeMulticallListeners({
  //         chainId,
  //         calls,
  //         options,
  //       }),
  //     )
  //   }
  // }, [chainId, dispatch, options, serializedCallKeys])

  // return useMemo(
  //   () =>
  //     calls.map<CallResult>((call) => {
  //       if (!chainId || !call) return INVALID_RESULT

  //       const result = callResults[chainId]?.[toCallKey(call)]
  //       let data
  //       if (result?.data && result?.data !== '0x') {
  //         // eslint-disable-next-line prefer-destructuring
  //         data = result.data
  //       }

  //       return { valid: true, data, blockNumber: result?.blockNumber }
  //     }),
  //   [callResults, calls, chainId],
  // )
}


// export const getMulticallContract = () => {
//   return getContract(MultiCallAbi, getMulticallAddress(), simpleRpcProvider) as Multicall
// }

// const multicall = async (abi, calls) => {
//   const multi = getMulticallContract()
//   const itf = new Interface(abi)

//   const calldata = calls.map((call) => ({
//     target: call.address.toLowerCase(),
//     callData: itf.encodeFunctionData(call.name, call.params),
//   }))
//   const { returnData } = await multi.aggregate(calldata)

//   const res = returnData.map((call, i) => itf.decodeFunctionResult(calls[i].name, call))

//   return res
// }

function isValidMethodArgs(x) {
  return (
    x === undefined ||
    (Array.isArray(x) && x.every((xi) => isMethodArg(xi) || (Array.isArray(xi) && xi.every(isMethodArg))))
  )
}

export const getTrade = async (iToken, oToken, iAmount, oAmount, slippage, _deadline) => {

}

const getPath = async (ATokenAddress, BTokenAddress) => {
  let path = null;
  
  try {
      
    path = [ATokenAddress, BTokenAddress];
    const result = await getAmountsOut(parseEther("1"), path);
    const price = result[result.length - 1];
    // console.log('aaaaaaaaaaa price', formatEther(price));

    return path;
  } catch (error) {

    path = [ATokenAddress, wBNB, BTokenAddress];
    const result = await getAmountsOut(parseEther("1"), path);
    const price = result[result.length - 1];
    // console.log('ddddddddddd price', formatEther(price));

    return path;
  }

}


export const getGasEstimation = async (iToken, oToken, iAmount, oAmount, slippage, _deadline ) => {
  const account = getAccount();
  const path = await getPath(iToken.address, oToken.address);
  const deadline = Math.floor(Date.now() / 1000) + 60 * _deadline // 20 minutes from the current Unix time
  const amountOutMin = parseEther((oAmount * (1 - (slippage / 100))).toString());

  if(iToken.address == wBNB) {
    const method = router().methods.swapExactETHForTokens( amountOutMin, path, account, deadline );
    const gasEstimation = await method.estimateGas({
      from: account,
      value: iAmount,
    });
    return gasEstimation;
  }
  else if (oToken.address == wBNB) {
    const method = router().methods.swapExactTokensForETH( parseEther(iAmount), amountOutMin, path, account, deadline )
    const gasEstimation = await method.estimateGas({
      from: account
    });
    return gasEstimation;
  } else {
    console.log("asdfasdf");
    const method = router().methods.swapExactTokensForTokens( parseEther(iAmount), amountOutMin, path, account, deadline )
    const gasEstimation = await method.estimateGas({
      from: account
    });
    return gasEstimation;
  }
};

export const calculateGasMargin = (value) => {
  return new BN(value).mul(new BN(120)).div(new BN(100));
}

export const swap = async (iToken, oToken, iAmount, oAmount, slippage, _deadline ) => {
  console.log("swap", iToken, oToken, iAmount, oAmount, slippage,_deadline);
  const account = getAccount();

  let path = await getPath(iToken.address, oToken.address);
  
  const deadline = Math.floor(Date.now() / 1000) + 60 * _deadline // 20 minutes from the current Unix time
  const _tempOAmount = parseInt(oAmount * (1 - (slippage / 100)) * 10 ** 18) / (10 ** 18) 
  const amountOutMin = parseEther(_tempOAmount.toString());

  const _iToken = new Token(iToken.chainId, iToken.address, iToken.decimals, iToken.symbol, iToken.name);
  const _oTOken = new Token(iToken.chainId, oToken.address, oToken.decimals, oToken.symbol, oToken.name)
  const _pair = new Pair(new TokenAmount(_iToken, parseEther(iAmount) ), new TokenAmount(_oTOken, parseEther(oAmount)))
  const _route = new Route([_pair], _iToken)
  const trade = new Trade(_route, new TokenAmount(_iToken, parseEther(iAmount)), TradeType.EXACT_INPUT);
  const {priceImpactWithoutFee, realizedLPFee } = computeTradePriceBreakdown(trade);
  // const allowedPairs = useAllCommonPairs(_iToken, _oTOken)
  // console.log(allowedPairs, "Allowed Pairs");  

  // const dafasd = Trade.bestTradeExactIn(allowedPairs, parseEther(iAmount), _oTOken, { maxHops: 1, maxNumResults: 1 })[0] ?? null;  
  if(iToken.address == wBNB) {
    console.log("swapExactETHForTokens");

    const method = router().methods.swapExactETHForTokens( amountOutMin, path, account, deadline );
    const gasEstimation = await method.estimateGas({
      from: account,
      value: parseEther(iAmount),
    });
    await method
      .send({
        from: account,
        value: parseEther(iAmount),
        gas: gasEstimation,
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

export const getPriceImpactWithoutFee = async (iToken, oToken, iAmount, oAmount) => {
  if(iToken && oToken && iAmount && oAmount) {
    console.log("dddddddddddddd", iToken, oToken, iAmount, oAmount);
    const _iToken = new Token(iToken.chainId, iToken.address, iToken.decimals, iToken.symbol, iToken.name);
    const _oTOken = new Token(iToken.chainId, oToken.address, oToken.decimals, oToken.symbol, oToken.name)
    const _pair = new Pair(new TokenAmount(_iToken, parseEther(iAmount) ), new TokenAmount(_oTOken, parseEther(oAmount)))
    const _route = new Route([_pair], _iToken)
    const trade = new Trade(_route, new TokenAmount(_iToken, parseEther(iAmount)), TradeType.EXACT_INPUT);
    console.log('trade', trade);
    const result = computeTradePriceBreakdown(trade);
    return result;
  }
  return {
    priceImpactWithoutFee: null,
    realizedLPFee: null
  }
}

const BASE_FEE = new Percent(JSBI.BigInt(25), JSBI.BigInt(10000));
const ONE_HUNDRED_PERCENT = new Percent(JSBI.BigInt(10000), JSBI.BigInt(10000));
const INPUT_FRACTION_AFTER_FEE = ONE_HUNDRED_PERCENT.subtract(BASE_FEE);

// computes price breakdown for the trade
const computeTradePriceBreakdown = (trade) => {
  // for each hop in our trade, take away the x*y=k price impact from 0.3% fees
  // e.g. for 3 tokens/2 hops: 1 - ((1 - .03) * (1-.03))
  const realizedLPFee = !trade
    ? undefined
    : ONE_HUNDRED_PERCENT.subtract(
        trade.route.pairs.reduce(
          (currentFee) => currentFee.multiply(INPUT_FRACTION_AFTER_FEE),
          ONE_HUNDRED_PERCENT,
        ),
      )

  // remove lp fees from price impact
  const priceImpactWithoutFeeFraction = trade && realizedLPFee ? trade.priceImpact.subtract(realizedLPFee) : undefined

  // the x*y=k impact
  const priceImpactWithoutFeePercent = priceImpactWithoutFeeFraction
    ? new Percent(priceImpactWithoutFeeFraction?.numerator, priceImpactWithoutFeeFraction?.denominator)
    : undefined

  // the amount of the input that accrues to LPs
  const realizedLPFeeAmount =
    realizedLPFee &&
    trade &&
    (trade.inputAmount instanceof TokenAmount
      ? new TokenAmount(trade.inputAmount.token, realizedLPFee.multiply(trade.inputAmount.raw).quotient)
      : CurrencyAmount.ether(realizedLPFee.multiply(trade.inputAmount.raw).quotient))

  return { priceImpactWithoutFee: priceImpactWithoutFeePercent, realizedLPFee: realizedLPFeeAmount }
}
