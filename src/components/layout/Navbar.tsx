import { Button, Flex } from '@chakra-ui/react';
import Link from 'next/link';

const Navbar = () => {
    return (
        <Flex mt={4} maxWidth={190} width="100%" py="1" borderRadius="14px" justifyContent="space-around" bg="rgb(25, 27, 31)">
            <Link href="/">
                <Button>Swap</Button>
            </Link>
            <Link href="/liquidity">
                <Button>Liquidity</Button>
            </Link>
        </Flex>
    );
}

export default Navbar ;