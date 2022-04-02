import { useState, useEffect, useMemo, useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';
import { getWethContract, getRouterContract, getFactoryContract } from 'utils/contracts';
import { getSignerOrProvider } from 'utils';

export function useSigner (msg?:any) {
    const { library, account, connector } = useWeb3React();
    const [signer, setSigner] = useState();

    useEffect(() => {
        library
            .getSigner(account)
            .signMessage(msg ?? "Signed by the user!")
            .then((sign:any) => setSigner(sign))
    },[library, account, msg])

    return { msg, account, signer };
}


export function useSwapper() {
    const { library,...web3React } = useWeb3React();
    const [signer, setSigner] = useState(getSignerOrProvider(library));
    const [account, setAccount] = useState(undefined); // This is populated in a hook
    
    const [router, setRouter] = useState(
        getRouterContract("0x4489D87C8440B19f11d63FA2246f943F492F3F5F", signer)
    );
    
    const [weth, setWeth] = useState(
        getWethContract("0x3f0D1FAA13cbE43D662a37690f0e8027f9D89eBF", signer)
    );
    
    const [factory, setFactory] = useState(
        getFactoryContract("0x4EDFE8706Cefab9DCd52630adFFd00E9b93FF116", signer)
    );
}