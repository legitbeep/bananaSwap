import { Flex, NumberInput, NumberInputField, Select,  } from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import { useState, ChangeEventHandler, ChangeEvent, useContext } from 'react';

import { Contracts } from 'context/Contracts'
import { Coin } from 'type';

const CurrencySelect = (
        {currency, setCurrency, excludeCurrency}: 
        {currency?: Coin, setCurrency: (val:Coin) => void, excludeCurrency?: Coin}
    ) => {

    const { coins } = useContext(Contracts);

    const handleCurrency:ChangeEventHandler<HTMLSelectElement> = (e: ChangeEvent<HTMLSelectElement>) => {
        setCurrency(coins[parseInt(e.target.value)])
    }

    return (
    <Select widht="200px" placeholder='Select Currency' onChange={handleCurrency}>
        {
            coins && coins.map((coin,idx: number) => (
                excludeCurrency?.abbr !== coin.abbr &&
                <option key={idx} value={idx} >{coin.abbr}</option>
            ))
        }
    </Select>
)}

const CurrencyInput = (
    {   
        input,
        onChange,
        currency, 
        onCurrencyChange,
        excludeCurrency 
    } : { 
        input: string,
        onChange: (v:string) => void, 
        currency?: Coin,
        onCurrencyChange: (v:Coin) => void,
        excludeCurrency ?: Coin 
    }) => {

    const handleCurrencyChange = (val:Coin) => {
        onCurrencyChange(val);
    }
    const handleInputChange = (data: string) => {
            if (data.match(/^[0-9]*[.,]?[0-9]*$/))
                onChange(data);
    }

    return (  
        <Flex py={4} px={2} my={4} bg={"rgb(44, 47, 54)"} borderRadius="14px" _hover={{ border: "1px solid grey", outline: "none"}} outline="none" border="1px solid transparent">
            <NumberInput value={input} onChange={handleInputChange} >
                <NumberInputField placeholder="0.0" fontSize="28px" outline="none" border="none" _hover={{ outline: "none", border: "none"}} _focus={{ outline: "none", border: "none" }} />
            </NumberInput>
         
            <CurrencySelect currency={currency} setCurrency={handleCurrencyChange} excludeCurrency={excludeCurrency} />
        </Flex>
    )
}

export default CurrencyInput;