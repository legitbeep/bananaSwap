import { useState, useEffect, useMemo, useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';

export function useSigner (msg:any) {
    const { library, account, connector } = useWeb3React();
    const [signer, setSigner] = useState();

    useEffect(() => {
        library
            .getSigner(account)
            .signMessage(msg || "Signed by the user!")
            .then((sign:any) => setSigner(sign))
    },[library, account, msg])

    return { msg, account, signer };
}

