import { Web3Provider } from "@ethersproject/providers";

export function getLibrary (provider:any) {
    const lib = new Web3Provider(provider);
    return lib;
}