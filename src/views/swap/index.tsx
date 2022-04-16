import { Box, useToast, Flex, Button, Heading } from '@chakra-ui/react'
import { useWeb3React } from '@web3-react/core';
import CurrencyInput from 'components/CurrencyInput'
import { useState, useContext, useEffect } from 'react';
import { Coin } from 'type';
import { SwapTokens, getReserves } from 'utils';

import COINS from 'utils/constants/coins';
import { Contracts } from 'context/Contracts';
import { Contract } from '@ethersproject/contracts';
import { JsonRpcSigner } from '@ethersproject/providers';

const Swap = () => {

    const [amnt1, setAmnt1] = useState("");
    const [amnt2, setAmnt2] = useState("");

    const [cur1, setCur1] = useState<Coin>();
    const [cur2, setCur2] = useState<Coin>();

    const [reserves, setReserves] = useState(["0.0", "0.0"]);

    const [loading, setLoading] = useState(false);

    const { account, library, chainId, ...web3React } = useWeb3React();
    const { coins, signer, router, factory, weth } = useContext(Contracts);

    const switchFields = () => {
        setAmnt1(amnt2);
        setAmnt2(amnt1);
        setCur1(cur2);;
        setCur2(cur1);
        setReserves(reserves.reverse());
    };

    const formatBalance = (balance:string, symbol: string) => {
        if (balance && symbol)
          return parseFloat(balance).toPrecision(6) + " " + symbol;
        else return "0.0";
      };

    // Determines whether the button should be enabled or not
    const isButtonEnabled = () => {

        // If both coins have been selected, and a valid float has been entered which is less than the user's balance, then return true
        const parsedInput1 = parseFloat(amnt1);
        const parsedInput2 = parseFloat(amnt2);
        return (
        cur1 && cur2 &&
        cur1.address &&
        cur2.address &&
        !isNaN(parsedInput1) &&
        !isNaN(parsedInput2) &&
        0 < parsedInput1 
        );
    };


    const handleSwap = () => {
        //SwapTokens(addr1, addr2, amnt1, routerContract , account, getSigner(account, library))
    }

    
  useEffect(() => {
    if (cur1?.address && cur2?.address && factory) {
        console.log(
            "Trying to get Reserves between:\n" + cur1?.address + "\n" + cur2?.address
        );

        getReserves(cur1?.address, cur2?.address, factory as Contract, signer as JsonRpcSigner, account ?? "").then(
            (data: any) => setReserves(data)
        );
    }
  }, [cur1?.address, cur2?.address, account, factory, router, signer]);

    return (
        <Box maxW={500} w="100%" p={4} borderRadius="20px" bg="rgb(25, 27, 31)">
            <Flex justifyContent="space-between">
                <Heading>Swap</Heading>
            </Flex>
            <CurrencyInput input={amnt1} currency={cur1} onChange={setAmnt1} onCurrencyChange={setCur1} excludeCurrency={cur2}/>
            <CurrencyInput input={amnt2} currency={cur2} onChange={setAmnt2} onCurrencyChange={setCur2} excludeCurrency={cur1}/>
            <Button w="full" py="6" onClick={handleSwap} disabled={!isButtonEnabled()}>
                Swap
            </Button>
        </Box>
    )
}

export default Swap;