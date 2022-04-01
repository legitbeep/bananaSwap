import { Contract } from "@ethersproject/contracts";
import { Provider } from "@ethersproject/providers";

// const ROUTER = require("./build/UniswapV2Router02.json");
// const ERC20 = require("./build/ERC20.json");
// const FACTORY = require("./build/IUniswapV2Factory.json");
// const PAIR = require("./build/IUniswapV2Pair.json");

export function getSwapContract(address: string , signer: Provider) {
    const contract = new Contract(address, swapAbi, signer);
}