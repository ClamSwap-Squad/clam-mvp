import { cloneDeep } from "lodash";

import { toCallKey } from "components/pancakeSwap/utils/multicallActions";

export const addMulticallListeners = (
  state,
  { calls, chainId, options: { blocksPerFetch = 1 } = {} }
) => {
  const listeners = state.multicall.callListeners ? cloneDeep(state.multicall.callListeners) : {};
  listeners[chainId] = listeners[chainId] ?? {};

  calls.forEach((call) => {
    const callKey = toCallKey(call);
    listeners[chainId][callKey] = listeners[chainId][callKey] ?? {};
    listeners[chainId][callKey][blocksPerFetch] =
      (listeners[chainId][callKey][blocksPerFetch] ?? 0) + 1;
  });

  return {
    multicall: {
      ...state.multicall,
      callListeners: listeners,
    },
  };
};

export const removeMulticallListeners = (
  state,
  { chainId, calls, options: { blocksPerFetch = 1 } = {} }
) => {
  const listeners = state.multicall.callListeners ? cloneDeep(state.multicall.callListeners) : {};

  if (!listeners[chainId]) return state;

  calls.forEach((call) => {
    const callKey = toCallKey(call);
    if (!listeners[chainId][callKey]) return;
    if (!listeners[chainId][callKey][blocksPerFetch]) return;

    if (listeners[chainId][callKey][blocksPerFetch] === 1) {
      delete listeners[chainId][callKey][blocksPerFetch];
    } else {
      listeners[chainId][callKey][blocksPerFetch]--;
    }
  });

  return {
    multicall: {
      ...state.multicall,
      callListeners: listeners,
    },
  };
};

export const fetchingMulticallResults = (state, { chainId, fetchingBlockNumber, calls }) => {
  const callResults = cloneDeep(state.multicall.callResults);
  callResults[chainId] = callResults[chainId] ?? {};
  calls.forEach((call) => {
    const callKey = toCallKey(call);
    const current = callResults[chainId][callKey];
    if (!current) {
      callResults[chainId][callKey] = {
        fetchingBlockNumber,
      };
    } else {
      if ((current.fetchingBlockNumber ?? 0) >= fetchingBlockNumber) return;
      callResults[chainId][callKey].fetchingBlockNumber = fetchingBlockNumber;
    }
  });

  return {
    multicall: {
      ...state.multicall,
      callResults,
    },
  };
};

export const errorFetchingMulticallResults = (state, { fetchingBlockNumber, chainId, calls }) => {
  const callResults = cloneDeep(state.multicall.callResults);

  calls.forEach((call) => {
    const callKey = toCallKey(call);
    const current = callResults[chainId][callKey];
    if (!current) return; // only should be dispatched if we are already fetching
    if (current.fetchingBlockNumber === fetchingBlockNumber) {
      delete current.fetchingBlockNumber;
      current.data = null;
      current.blockNumber = fetchingBlockNumber;
    }
  });

  return {
    multicall: {
      ...state.multicall,
      callResults,
    },
  };
};

export const updateMulticallResults = (state, { chainId, results, blockNumber }) => {
  const callResults = cloneDeep(state.multicall.callResults);

  callResults[chainId] = callResults[chainId] ?? {};
  Object.keys(results).forEach((callKey) => {
    const current = callResults[chainId][callKey];
    if ((current?.blockNumber ?? 0) > blockNumber) return;
    callResults[chainId][callKey] = {
      data: results[callKey],
      blockNumber,
    };
  });

  return {
    multicall: {
      ...state.multicall,
      callResults,
    },
  };
};
