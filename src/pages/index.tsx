import { Flex } from "@chakra-ui/react";

import Swap from 'views/swap';

const Home = () => {
  return (
    <Flex mb={8} w="full" justifyContent="center" py="8">
      <Swap />
    </Flex>
  );
};

export default Home;
