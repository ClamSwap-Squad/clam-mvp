import { ChainId, Token } from '@pancakeswap/sdk'

const { MAINNET, TESTNET } = ChainId

export const mainnetTokens = [
    {
        name: "PancakeSwap Token",
        symbol: "CAKE",
        address: "0xa35062141Fa33BCA92Ce69FeD37D0E8908868AAe",
        decimals: 18,
        projectLink: "https://pancakeswap.finance/",
    },
    {
        name: "Binance USD",
        symbol: "BUSD",
        address: "0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee",
        decimals: 18,
        projectLink: "https://www.paxos.com/busd/",
    },
    {
        name: "SyrupBar Token",
        symbol: "SYRUP",
        address: "0xfE1e507CeB712BDe086f3579d2c03248b2dB77f9",
        decimals: 18,
        projectLink: "https://pancakeswap.finance/",
    },
    {
        name: "Bakeryswap Token",
        symbol: "BAKE",
        address: "0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5",
        decimals: 18,
        projectLink: "https://www.bakeryswap.org/",
    },
]



export const testnetTokens = [
    {
        name: "PancakeSwap Token",
        symbol: "CAKE",
        address: "0xf9f93cf501bfadb6494589cb4b4c15de49e85d0e",
        decimals: 18,
        projectLink: "https://pancakeswap.finance/",
    },
    {
        name: "BUSD",
        symbol: "BUSD",
        address: "0x78867bbeef44f2326bf8ddd1941a4439382ef2a7",
        decimals: 18,
        projectLink: "https://www.paxos.com/busd/",
    },
    {
        name: "DAI TOKEN",
        symbol: "DAI",
        address: "0x8a9424745056eb399fd19a0ec26a14316684e274",
        decimals: 18,
        projectLink: "https://pancakeswap.finance/",
    },
    {
        name: "Tether USD",
        symbol: "USDT",
        address: "0x7ef95a0fee0dd31b22626fa2e10ee6a223f8a684",
        decimals: 18,
        projectLink: "https://www.bakeryswap.org/",
    },
]
