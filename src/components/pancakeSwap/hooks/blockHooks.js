import { useEffect } from "react";
import { useAction, useSelector } from "redux-zero/react";

import { actions } from "store/redux";

import { simpleRpcProvider } from "../utils/providers";

const { setBlock: setBlockAC } = actions();

export const usePollBlockNumber = () => {
  const setBlock = useAction(setBlockAC);

  const getData = async () => {
    const blockNumber = await simpleRpcProvider.getBlockNumber();
    setBlock(blockNumber);
  };

  useEffect(() => {
    const intervalCall = setInterval(() => {
      getData();
    }, 6000);
    return () => {
      // clean up
      clearInterval(intervalCall);
    };
  }, []);
};

export const useCurrentBlock = () => {
  return useSelector((state) => state.block.currentBlock);
};
