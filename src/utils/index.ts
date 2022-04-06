import { InjectedConnector } from "@web3-react/injected-connector";
import { getAddress } from '@ethersproject/address'
import { Web3Provider, JsonRpcSigner } from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";
import { formatEther, parseEther } from "@ethersproject/units";
import { BigNumber } from "@ethersproject/bignumber";
import COINS from "./constants/coins";

import ERC20 from 'artifacts/ERC20.json';
import PAIR from 'artifacts/IUniswapV2Pair.json';

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
    );

    const token1 = new Contract(addr1, ERC20.abi, signer)
    token1.approve(routerContract.address, amntIn);

    // @ts-ignore
    if ( addr1 === COINS.AUTONITY.address ){
        await routerContract.swapExactETHForTokens(
            amntOut[1],
            tokens,
            accAddr,
            deadline,
            { value: amntIn }
        );
    // @ts-ignore
    } else if ( addr2 === COINS.AUTONITY.address ){
        await routerContract.swapExactTokensForETH(
            amntIn,
            amntOut[1],
            tokens,
            accAddr,
            deadline,
        );
    } else {

        await routerContract.swapExactTokensForTokens(
            amntIn,
            amntOut[1],
            tokens,
            accAddr,
            deadline
          );
    }
}

// preview swap using router contract and return amount out
export async function getAmountOut(
    addr1: string,
    addr2: string,
    amntIn: string,
    routerContract: Contract
  ) {
    try {
      const values_out = await routerContract.getAmountsOut(
        parseEther(amntIn),
        [addr1, addr2]
      );
      const amount_out = formatEther(values_out[1]);
      return Number(amount_out);
    } catch {
      return false;
    }
  }

export async function fetchReserves(
    addr1 : string,
    addr2 : string,
    pair: any
) {
    try {
        const reservesRaw = await pair.getReserves();
        let results = [
            Number(formatEther(reservesRaw[0])),
            Number(formatEther(reservesRaw[1])),
        ];

        return [
            (await pair.token0()) === addr1 ? results[0] : results[1],
            (await pair.token1()) === addr2 ? results[1] : results[0],
        ];
        } catch (err) {
        console.log("no reserves yet");
        return [0, 0];
        }
}

export async function getReserves(
  addr1: string,
  addr2: string,
  factory: Contract,
  signer: JsonRpcSigner | Web3Provider,
  accAddr: string
) {
    const pairAddr = await factory.getPair(addr1, addr2);
    const pair = new Contract(pairAddr, PAIR.abi, signer);

    const reservesRaw = await fetchReserves(addr1, addr2, pair);
    const liquidityTokens_BN = await pair.balancecOf(accAddr);
    const liquidityTokens = Number(
        formatEther(liquidityTokens_BN)
    ).toFixed(2);

    return [
        reservesRaw[0].toFixed(2),
        reservesRaw[1].toFixed(2),
        liquidityTokens
    ]


}