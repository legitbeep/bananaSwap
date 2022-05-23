import { InjectedConnector } from "@web3-react/injected-connector";
import { getAddress } from '@ethersproject/address'
import { Web3Provider, JsonRpcSigner } from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";
import { formatEther, parseEther, parseUnits } from "@ethersproject/units";
import { BigNumber } from "@ethersproject/bignumber";
import COINS from "./constants/coins";

import ERC20 from 'artifacts/ERC20.json';
import PAIR from 'artifacts/IUniswapV2Pair.json';

export const injected = new InjectedConnector({ supportedChainIds: [3] }); // only ropsten

// fetch data using library functions
export function fetcher (lib: any) {
    return function(...args: any) {
        const [method, ...params] = args;
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
    accountAddress: string,
    address: string,
    provider: Web3Provider,
    signer: JsonRpcSigner,
    weth_address: string,
){
    try {
        if (address === weth_address) {
          const balanceRaw = await provider.getBalance(accountAddress);
    
          return formatEther(balanceRaw)
        } else {
          const token = new Contract(address, ERC20.abi, signer);
          const tokenDecimals = await getDecimals(token);
          const balanceRaw = await token.balanceOf(accountAddress);
    
          return (balanceRaw*10**(-tokenDecimals)).toString();
        }
      } catch(err) {
        console.log(err)
    }
    return "0";
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

    try {
        const token1 = new Contract(addr1, ERC20.abi, signer)
        token1.approve(routerContract.address, amntIn);
        console.log(COINS.get(3));
        // @ts-ignore
        if ( addr1 === COINS.get(3)[0].address ){
            await routerContract.swapExactETHForTokens(
                amntOut[1],
                tokens,
                accAddr,
                deadline,
                { value: amntIn }
            );
        // @ts-ignore
        } else if ( addr2 === COINS.get(3)[0].address ){
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
    } catch (e) {
        console.log(e)
    }
}



export async function getDecimals(token: Contract) {
    const decimals = await token.decimals().then((result: any) => {
        return result;
      }).catch((err:any) => {
        console.log('No tokenDecimals function for this token, set to 0');
        return 0;
      });
      return decimals;
  }  

// preview swap using router contract and return amount out
export async function getAmountOut(
    addr1: string,
    addr2: string,
    amntIn: string,
    routerContract: Contract,
    signer: JsonRpcSigner
  ) {
    try {
        const token1 = new Contract(addr1, ERC20.abi, signer);
        const token1Decimals = await getDecimals(token1);
    
        const token2 = new Contract(addr2, ERC20.abi, signer);
        const token2Decimals = await getDecimals(token2);
    
        const values_out = await routerContract.getAmountsOut(
          parseUnits(String(amntIn), token1Decimals),
          [addr1, addr2]
        );
        const amount_out = values_out[1]*10**(-token2Decimals);
        console.log('amount out: ', amount_out)
        return Number(amount_out);
    } catch {
      return false;
    }
  }

export async function fetchReserves(
    addr1 : string,
    addr2 : string,
    pair: Contract
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
    try {
        const pairAddress = await factory.getPair(addr1, addr2);
        const pair = new Contract(pairAddress, PAIR.abi, signer);
    
        if (pairAddress !== '0x0000000000000000000000000000000000000000'){
            const reservesRaw = await fetchReserves(addr1, addr2, pair);
            const liquidityTokens_BN = await pair.balanceOf(accAddr);
            const liquidityTokens = Number(
                formatEther(liquidityTokens_BN)
            );

            return [
                reservesRaw[0].toPrecision(6),
                reservesRaw[1].toPrecision(6),
                liquidityTokens,
            ];
        } else {
            console.log("no reserves yet");
            return [0,0,0];
        }
    }catch (err) {
        console.log("error!");
        console.log(err);
        return [0, 0, 0];
    }
}