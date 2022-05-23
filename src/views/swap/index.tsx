import { Box, useToast, Flex, Button, Heading } from '@chakra-ui/react'
import { useWeb3React } from '@web3-react/core';
import { useState, useContext, useEffect } from 'react';
import {MdSwapVert} from 'react-icons/md'
import { Contract } from '@ethersproject/contracts';
import { JsonRpcSigner } from '@ethersproject/providers';

import CurrencyInput from 'components/CurrencyInput'
import { Coin } from 'type';
import { SwapTokens, getReserves, getAmountOut, getBalAndSym } from 'utils';
import COINS from 'utils/constants/coins';
import { Contracts } from 'context/Contracts';

const Swap = () => {
    const toast = useToast();

    const [amnt1, setAmnt1] = useState("");
    const [amnt2, setAmnt2] = useState("");

    const [bal1, setBal1] = useState("");
    const [bal2, setBal2] = useState("");

    const [cur1, setCur1] = useState<Coin>();
    const [cur2, setCur2] = useState<Coin>();

    const [reserves, setReserves] = useState([]);

    const [loading, setLoading] = useState(false);

    const { account, library, chainId, ...web3React } = useWeb3React();
    const { coins, signer, router, factory, weth } = useContext(Contracts);

    const switchFields = () => {
        setAmnt1(amnt2);
        setAmnt2(amnt1);
        const tempCur = cur1;
        setCur1(cur2);
        setCur2(tempCur);
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
        console.log("Attempting to swap tokens...", cur1?.address, cur2?.address);
        setLoading(true);
        if ( router && account && signer ) {
            SwapTokens(
                cur1!.address,
                cur2!.address,
                amnt1,
                router,
                account,
                signer
            )
                .then(() => {
                setLoading(false);
        
                // If the transaction was successful, we clear to input to make sure the user doesn't accidental redo the transfer
                setAmnt1("");
                toast({
                    title: 'Tx Success',
                    description: "Coins Swapped.",
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                    })
                })
                .catch((e) => {
                    console.log(e);
                    setLoading(false);
                    toast({
                        title: 'Error',
                        description: "Transaction Failed.",
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                        })
                    });
        } else {
            toast({
                title: 'Error',
                description: "Please connect wallet.",
                status: 'error',
                duration: 5000,
                isClosable: true,
                })
        }
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

  useEffect(() => {
    if (isNaN(parseFloat(amnt1))) {
      setAmnt2("");
    } else if (parseFloat(amnt1) && cur1?.address && cur2?.address) {
        getAmountOut(cur1.address, cur2.address, amnt1, router as Contract, signer as JsonRpcSigner).then(
        (amount: any) => setAmnt2(amount.toFixed(7))
      ).catch(e => {
        console.log(e);
        setAmnt2("NA");
      })
    } else {
      setAmnt2("");
    }
  }, [amnt1, cur1, cur2]);

  useEffect(() => {
      if ( cur1?.address && cur2?.address && account && signer ) {
        getBalAndSym(account, cur1.address, library, signer, coins[0].address).then((data: string) => {
            setBal1(data);
        })
        getBalAndSym(account, cur2.address, library, signer, coins[0].address).then((data: string) => {
            setBal2(data);
        })
      }
  }
  ,[cur1, cur2])

    return (
        <Box >
            <Box position="relative" maxW={500} w="100%" p={4} borderRadius="20px" bg="rgb(25, 27, 31)" >
                <Flex justifyContent="space-between">
                    <Heading>Swap</Heading>
                </Flex>
                <CurrencyInput input={amnt1} currency={cur1} onChange={setAmnt1} onCurrencyChange={setCur1} excludeCurrency={cur2}/>
                <Button onClick={switchFields} position="absolute" size="sm" left="45%" top="45%" bg="rgb(25, 27, 31)" p="0">
                    <MdSwapVert />
                </Button>
                <CurrencyInput input={amnt2} currency={cur2} onChange={setAmnt2} onCurrencyChange={setCur2} excludeCurrency={cur1}/>
                <Button w="full" py="6" onClick={handleSwap} disabled={!isButtonEnabled()}>
                    Swap
                </Button>
            </Box>
            {
                reserves.length ? 
                    <Box maxW={500} w="100%" p={4} mt={4} borderRadius="20px" bg="rgb(25, 27, 31)">
                        <Flex justifyContent="space-between">
                            <Heading fontSize="20px">Reserves</Heading>
                        </Flex>
                        <Flex justifyContent="space-between" p={4} >
                            <Heading as="h3" fontSize="16px">{cur1?.abbr}</Heading>
                            <Heading as="h3" fontSize="16px">{cur2?.abbr}</Heading>
                        </Flex>
                        <Flex justifyContent="space-between" borderRadius="14px" p={4} bg={"rgb(44, 47, 54)"}>
                            <Heading as="h3" fontSize="16px">{reserves[0]}</Heading>
                            <Heading as="h3" fontSize="16px">{reserves[1]}</Heading>
                        </Flex>
                    </Box>
                : null
            }
            {
                bal1 != "" && bal2 != "" ? 
                    <Box maxW={500} w="100%" p={4} mt={4} borderRadius="20px" bg="rgb(25, 27, 31)">
                        <Flex justifyContent="space-between">
                            <Heading fontSize="20px">Balance</Heading>
                        </Flex>
                        <Flex justifyContent="space-between" p={4} >
                            <Heading as="h3" fontSize="16px">{cur1?.abbr}</Heading>
                            <Heading as="h3" fontSize="16px">{cur2?.abbr}</Heading>
                        </Flex>
                        <Flex justifyContent="space-between" borderRadius="14px" p={4} bg={"rgb(44, 47, 54)"}>
                            <Heading as="h3" fontSize="16px">{bal1}</Heading>
                            <Heading as="h3" fontSize="16px">{bal2}</Heading>
                        </Flex>
                    </Box>
                : null
            }
        </Box>
    )
}

export default Swap;