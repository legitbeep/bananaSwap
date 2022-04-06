import { Flex, NumberInput, NumberInputField, Select,  } from '@chakra-ui/react';
import { getNetwork } from '@ethersproject/networks';
import { useWeb3React } from '@web3-react/core';
import { useState, ChangeEventHandler, ChangeEvent } from 'react';

import { ROPSTENCoins as coins } from 'utils/constants/coins';

const CurrencySelect = ({currency, setCurrency, excludeCurrency}: {currency: string, setCurrency: (val:string) => void, excludeCurrency?: string}) => {


    const handleCurrency:ChangeEventHandler<HTMLSelectElement> = (e: ChangeEvent<HTMLSelectElement>) => {
        setCurrency(e.target.value)
    }
    
    return (
    <Select widht="200px" placeholder='Select Currency' value={currency} onChange={handleCurrency}>
        {
            coins.map((coin,idx: number) => (
                excludeCurrency !== coin.abbr &&
                <option key={idx} value={coin.abbr}>{coin.abbr}</option>
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
        currency: string,
        onCurrencyChange: (v:string) => void,
        excludeCurrency ?: string 
    }) => {

    const handleCurrencyChange = (val:string) => {
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