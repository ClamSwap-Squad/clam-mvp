import { parseUnits } from "@ethersproject/units";
import { Currency, CurrencyAmount, ETHER, JSBI, Token, TokenAmount, Trade } from "@pancakeswap/sdk";

import { useActiveWeb3React } from "./useActiveWeb3React";
import { useCurrency } from "./Tokens";
import { useCurrencyBalances } from "./walletHooks";
import { useTradeExactIn, useTradeExactOut } from "./Trades";

// try to parse a user entered amount for a given token
export function tryParseAmount(value, currency) {
  if (!value || !currency) {
    return undefined;
  }
  try {
    const typedValueParsed = parseUnits(value, currency.decimals).toString();
    if (typedValueParsed !== "0") {
      return currency instanceof Token
        ? new TokenAmount(currency, JSBI.BigInt(typedValueParsed))
        : CurrencyAmount.ether(JSBI.BigInt(typedValueParsed));
    }
  } catch (error) {
    // should fail if the user specifies too many decimal places of precision (or maybe exceed max uint?)
    console.debug(`Failed to parse input amount: "${value}"`, error);
  }
  // necessary for all paths to return a value
  return undefined;
}

export function useDerivedSwapInfo(inputCurrencyId, outputCurrencyId, typedValue) {
  const { account } = useActiveWeb3React();

  const inputCurrency = useCurrency(inputCurrencyId);
  const outputCurrency = useCurrency(outputCurrencyId);
  const to = account ?? null;

  const relevantTokenBalances = useCurrencyBalances(account ?? undefined, [
    inputCurrency ?? undefined,
    outputCurrency ?? undefined,
  ]);

  /** From input value to output */
  const isExactIn = true;
  const parsedAmount = tryParseAmount(
    typedValue,
    (isExactIn ? inputCurrency : outputCurrency) ?? undefined
  );

  const bestTradeExactIn = useTradeExactIn(isExactIn ? parsedAmount : undefined, outputCurrency ?? undefined)
  //const bestTradeExactOut = useTradeExactOut(inputCurrency ?? undefined, !isExactIn ? parsedAmount : undefined)

  return {};
}
