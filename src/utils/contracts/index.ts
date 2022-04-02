import { Contract } from "@ethersproject/contracts";
import { Web3Provider, JsonRpcSigner } from "@ethersproject/providers";

const ROUTER = require("artifacts/UniswapV2Router02.json");
const ERC20 = require("artifacts/ERC20.json");
const FACTORY = require("artifacts/IUniswapV2Factory.json");
const PAIR = require("artifacts/IUniswapV2Pair.json");

export function getRouterContract(address: string , signer: Web3Provider | JsonRpcSigner) {
    const contract = new Contract(address, ROUTER.abi, signer);
    return contract;
}

export function getWethContract(address: string , signer: Web3Provider | JsonRpcSigner) {
    const contract = new Contract(address, ERC20.abi, signer);
    return contract;
}

export function getFactoryContract(address: string , signer: Web3Provider | JsonRpcSigner) {
    const contract = new Contract(address, FACTORY.abi, signer);
    return contract;
}

export function getPairContract(address: string , signer: Web3Provider | JsonRpcSigner) {
    const contract = new Contract(address, PAIR.abi, signer);
    return contract;
}