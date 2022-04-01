import { InjectedConnector } from "@web3-react/injected-connector";

export const injected = new InjectedConnector({ supportedChainIds: [3] }); // only ropsten

export function fetcher (lib: any) {
    return function(...args: any) {
        const [method, ...params] = args;
        console.log({ method, params });
        return lib[method](...params);
    }
}