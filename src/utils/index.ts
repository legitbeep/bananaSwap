import { InjectedConnector } from "@web3-react/injected-connector";
import { getAddress } from '@ethersproject/address'
import { Web3Provider, JsonRpcSigner } from "@ethersproject/providers";

export const injected = new InjectedConnector({ supportedChainIds: [3] }); // only ropsten

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