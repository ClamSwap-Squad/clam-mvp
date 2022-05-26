import { contractFactory } from "./index";
import clamShopAbi from "./abi/ClamShop.json";
import { clamShopAddress } from "../constants/constants";

const clamShop = () =>
  contractFactory({
    abi: clamShopAbi,
    address: clamShopAddress,
  });

export const getClamsPerWeek = async () => {
  const value = clamShop().methods.clamsPerWeek().call();
  return value;
};

export const getMintedThisWeek = async () => {
  const value = clamShop().methods.mintedThisWeek().call();
  return value;
};

export const getUpdatedPrice = async (_grade) => {
  const value = clamShop().methods.getUpdatedPrice(_grade).call();
  return value;
}

export const getUpdatedPearlPrice = async (_grade) => {
  const value = clamShop().methods.getUpdatedPearlPrice(_grade).call();
  return value;
}
