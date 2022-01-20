import { useActiveWeb3React } from './useActiveWeb3React';

// returns a function that will execute a swap
export function useSwapCallback(
  trade // trade to execute, required
) {
  const { account, chainId, library } = useActiveWeb3React();
  console.log({account, chainId, library})
}
