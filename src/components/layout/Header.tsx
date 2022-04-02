import { useState, useEffect } from 'react';
import { Box, Button, Flex, Heading, useToast } from "@chakra-ui/react";
import Link from "next/link";
import useSWR, { mutate } from 'swr';
import { formatEther } from '@ethersproject/units';

import ThemeToggle from "./ThemeToggle";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { injected, fetcher } from 'utils'
import { shortenAddress } from 'utils';

const Header = () => {
  
  const { active, account, library, connector, error, activate, deactivate } = useWeb3React();
  const isUnsupportedChainIdError = error instanceof UnsupportedChainIdError;  
  const toast = useToast();

  const { data: balance } = useSWR(['getBalance', account, 'latest'], {
    fetcher: fetcher(library),
  })

  useEffect(() => {
    // @ts-ignore
    if (typeof window.ethereum === 'undefined') {
      alert('Please install metamask to continue!');
    }
  },[]);

  useEffect(() =>{
    isUnsupportedChainIdError && toast({
      title: 'Error.',
      description: "Connected to unsupported chain.",
      status: 'error',
      duration: 6000,
      isClosable: true,
    })
  },[account,isUnsupportedChainIdError,active])

  const connect = async () => {
    if (isUnsupportedChainIdError) {
      toast({
        title: 'Error.',
        description: "Connected to unsupported chain, please change to ropsten",
        status: 'error',
        duration: 6000,
        isClosable: true,
      })
      deactivate();
      return;
    }
    if(!active){
      try {
        // will only support ropsten
        await activate(injected);
      } catch(err) {
        console.error(err);
      }
    }
  }

  return (
    <Flex as="header" width="full" align="center">
      <Heading as="h1" size="md">
        <Link href="/">uSwap</Link>
      </Heading>
  
      <Box marginLeft="auto">
        <Button onClick={connect} mr={3}>{account ? shortenAddress(account) + " | " + ( balance ? parseFloat(formatEther(balance)).toPrecision(4) : "...") + " ETH" : "Connect"}</Button>
        <ThemeToggle />
      </Box>
    </Flex>
  )
};

export default Header;
