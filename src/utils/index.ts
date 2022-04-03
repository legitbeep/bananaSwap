import { InjectedConnector } from "@web3-react/injected-connector";
import { getAddress } from '@ethersproject/address'
import { Web3Provider, JsonRpcSigner } from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";
import { formatEther, parseEther } from "@ethersproject/units";
import { BigNumber } from "@ethersproject/bignumber";
import COINS from "./constants/coins";

export const injected = new InjectedConnector({ supportedChainIds: [3] }); // only ropsten

// fetch data using library functions
export function fetcher (lib: any) {
    return function(...args: any) {
        const [method, ...params] = args;
        console.log({ method, params });
        return lib[method](...params);
    }
}

// account is optional
export function getSignerOrProvider(library: Web3Provider, account?: string): Web3Provider | JsonRpcSigner {
    return account ? getSigner(library, account) : library
}

// account is not optional
export function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
    return library.getSigner(account).connectUnchecked()
}


// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
    try {
      return getAddress(value)
    } catch {
      return false
    }
}
  
// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
    const parsed = isAddress(address)
    if (!parsed) {
        throw Error(`Invalid 'address' parameter '${address}'.`)
    }
    return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}

export async function getBalAndSym(
    address: string,
    accAddr: string,
    signer: JsonRpcSigner,
    abi: any
){
    try{ 
        const token = new Contract(address, abi, signer);
        const balRaw = await token.balanceOf(accAddr);
        const symbol = await token.symbol();
        return {
            balance: formatEther(balRaw) ,
            symbol
        } 
    } catch(err) {
        console.log(err)
    }
    return null;
}

//  Calls different function on Router contract:
//     If address1 of the Weth contract, calls the Router function swapExactETHForTokens
//     If address2 of the Weth contract, calls the Router function swapExactTokensForETH
//     If neither of the Weth contract, calls the Router function swapExactTokensForTokens
export async function SwapTokens(
    addr1: string,
    addr2: string,
    amnt: string,
    routerContract: Contract,
    accAddr: string,
    signer: JsonRpcSigner
) {
    const tokens = [addr1, addr2];
    const time = Math.floor(Date.now() / 1000) + 200000;
    const deadline = BigNumber.from(time);

    const amntIn = parseEther(amnt);
    const amntOut = await routerContract.callStatic.getAmountsOut(
        amntIn,
        tokens
    );;

    console.log({COINS, amntIn, amntOut});

}