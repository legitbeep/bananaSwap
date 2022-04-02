import { Flex, Input, InputGroup, InputLeftElement, InputRightElement, MenuItemOption, Select } from '@chakra-ui/react';

const CurrencySelect = () => (
    <Select widht="300px" placeholder='Select Currency'>
        <option value='A'>ABC</option>
        <option value='A'>ABC</option>
        <option value='A'>ABC</option>
    </Select>
)

const CurrencyInput = () => {
    return (  
        <Flex py={4} px={2} my={4} bg={"rgb(44, 47, 54)"} borderRadius="14px" _hover={{ border: "1px solid grey", outline: "none"}} outline="none" border="1px solid transparent">
            <Input placeholder="0.0" fontSize="24px" outline="none" border="none" _hover={{ outline: "none", border: "none"}} _focus={{ outline: "none", border: "none" }}/>
            <CurrencySelect />
        </Flex>
    )
}

export default CurrencyInput;