import { useActiveWeb3React } from "./useActiveWeb3React";
import { INITIAL_ALLOWED_SLIPPAGE } from "../constants";
import { getRouterContract } from "../utils";

/**
 * Returns the swap calls that can be used to make the trade
 * @param trade trade to execute
 * @param allowedSlippage user allowed slippage
 * @param recipientAddressOrName
 */
function useSwapCallArguments(
  trade, // trade to execute, required
  allowedSlippage = INITIAL_ALLOWED_SLIPPAGE, // in bips
  recipientAddressOrName, // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
) {
  const { account, chainId, library } = useActiveWeb3React();
  const recipient = account;
  if (!chainId || !library || !account) {
    return;
  }
  const contract = getRouterContract(chainId, library, account);
}

// returns a function that will execute a swap
export function useSwapCallback(
  trade, // trade to execute, required
  allowedSlippage = INITIAL_ALLOWED_SLIPPAGE, // in bips
  recipientAddressOrName // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
) {
  const { account, chainId, library } = useActiveWeb3React();
  const swapCalls = useSwapCallArguments(trade, allowedSlippage, recipientAddressOrName);
}
