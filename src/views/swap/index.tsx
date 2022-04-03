import { Box, useToast, Flex, Button, Heading } from '@chakra-ui/react'
import { useWeb3React } from '@web3-react/core';
import CurrencyInput from 'components/CurrencyInput'
import { useState } from 'react';
import { getSigner, SwapTokens } from 'utils';

const Swap = () => {

    const [amnt1, setAmnt1] = useState("");
    const [amnt2, setAmnt2] = useState("");

    const [addr1, setAddr1] = useState("");
    const [addr2, setAddr2] = useState("");

    const { account, library, ...web3React } = useWeb3React();

    const handleSwap = () => {
        //SwapTokens(addr1, addr2, amnt1, routerContract , account, getSigner(account, library))
    }

    return (
        <Box maxW={500} w="100%" p={4} borderRadius="20px" bg="rgb(25, 27, 31)">
            <Flex justifyContent="space-between">
                <Heading>Swap</Heading>

            </Flex>
            <CurrencyInput onChange={setAddr1} onCurrencyChange={setAddr1}/>
            <CurrencyInput onChange={setAddr2} onCurrencyChange={setAddr2}/>
            <Button w="full" py="6" onClick={handleSwap}>
                Swap
            </Button>
        </Box>
    )
}

export default Swap;