import { Box, useToast, Flex, Button, Heading } from '@chakra-ui/react'
import CurrencyInput from 'components/CurrencyInput'

const Swap = () => {
    return (
        <Box maxW={550} w="100%" p={4} borderRadius="20px" bg="rgb(25, 27, 31)">
            <Flex justifyContent="space-between">
                <Heading>Swap</Heading>

            </Flex>
            <CurrencyInput />
            <CurrencyInput />
            <Button w="full" py="6">
                Swap
            </Button>
        </Box>
    )
}

export default Swap;