import mainnetAddresses from "./mainnet";
import testnetAddresses from "./testnet";
import { mainnetTokens, testnetTokens } from "./tokens";

// this sets addresses of testnet when running locally. Change this if mainnet addresses are desired
const addresses =
  process.env.NODE_ENV === "development" || window.location.hostname === "clam-island-beta.web.app"
    ? testnetAddresses
    : mainnetAddresses;


export const ClamIslandChain = {
  BSC: 56,
  BSC_TESTNET: 97,
  Localhost: 1337,
  Hardhat: 31337,
};

// legacy contracts
export const clamPresaleAddress = "0xAAEB1Ea585DbeF06349ac371EBBA54efa0713D1D";
export const shellPresaleAddress = "0x28D51F0E6CC2138fB134986423cb7429E713763E";
export const communityVotingAddress = "0x000F56780E4DC3f619A08EDf84948780be5C83Cf";
export const clamClaimersAddress = "0xDaF219f41931B4833A71B9D08881491010246691";

export const zeroHash = "0x0000000000000000000000000000000000000000000000000000000000000000";

export const communityRewardsAddress = "0x6684C3Fb0a85cE9B05187c770c4aa6A824Ed590C";

export const tokens =  
    process.env.NODE_ENV === "development" || window.location.hostname === "clam-island-beta.web.app"
      ? testnetTokens
      : mainnetTokens;



export const {
  shellTokenAddress,
  clamNFTAddress,
  gemTokenAddress,
  gemLockerAddress,
  gemLockerV2Address,
  pearlProductionTimeReductionAddress,
  bankAddress,
  pearlDnaDecoderAddress,
  pearlNFTAddress,
  pearlBurnerAddress,
  rngAddress,
  dnaDecoderAddress,
  clamLotteryAddress,
  clamShopAddress,
  pearlFarmAddress,
  pearlHuntAddress,
  gemOracleAddress,
  clamExchangeAddress,
  pancakeRouterAddress,
  pancakeFactoryAddress,
  multicallAddress,
  wBNB,
  BUSD,
  zapAddress,
} = addresses;



export const serializeTokens = [
  {
    address: wBNB,
    decimals: 18,
    logoURI: "https://pancake.kiemtienonline360.com/images/coins/0xae13d989dac2f0debff460ac112a837c89baa7cd.png",
    name: "BNB",
    symbol: "BNB",
    chainId: ClamIslandChain.BSC_TESTNET
  },
  {
    address: gemTokenAddress,
    decimals: 18,
    logoURI: `${process.env.PUBLIC_URL}/favicon/android-chrome-192x192.png`,
    name: "GEM",
    symbol: "GEM",
    chainId: ClamIslandChain.BSC_TESTNET
  },
  {
    address: shellTokenAddress,
    decimals: 18,
    logoURI: `${process.env.PUBLIC_URL}/favicon/android-chrome-192x192.png`,
    name: "SHELL",
    symbol: "SHELL",
    chainId: ClamIslandChain.BSC_TESTNET
  }
];
    