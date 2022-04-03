import { Flex, NumberInput, NumberInputField, Select } from '@chakra-ui/react';
import { useState, ChangeEventHandler, ChangeEvent } from 'react';

const CurrencySelect = ({currency, setCurrency}: {currency: string, setCurrency: (val:string) => void}) => {
    const handleCurrency:ChangeEventHandler<HTMLSelectElement> = (e: ChangeEvent<HTMLSelectElement>) => {
        setCurrency(e.target.value)
    }
    return (
    <Select widht="300px" placeholder='Select Currency' value={currency} onChange={handleCurrency}>
        <option value='A'>ABC</option>
        <option value='A'>ABC</option>
        <option value='A'>ABC</option>
    </Select>
)}

const CurrencyInput = (
    {   
        onChange, 
        onCurrencyChange 
    } : { 
        onChange: (v:string) => void, 
        onCurrencyChange: (v:string) => void 
    }) => {
    const [input, setInput] = useState("");
    const [currency, setCurrency] = useState("");
    const handleInputChange = (e: string) => {
            let data = e;
            if (data.match(/^[0-9]*[.,]?[0-9]*$/))
            {   
                setInput(data);
                onChange(data);
            } 
    }

    return (  
        <Flex py={4} px={2} my={4} bg={"rgb(44, 47, 54)"} borderRadius="14px" _hover={{ border: "1px solid grey", outline: "none"}} outline="none" border="1px solid transparent">
            <NumberInput value={input} onChange={handleInputChange} >
                <NumberInputField placeholder="0.0" fontSize="24px" outline="none" border="none" _hover={{ outline: "none", border: "none"}} _focus={{ outline: "none", border: "none" }} />
            </NumberInput>
            <CurrencySelect currency={currency} setCurrency={setCurrency} />
        </Flex>
    )
}

export default CurrencyInput;