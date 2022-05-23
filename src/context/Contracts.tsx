import { useRef, useState, useEffect, createContext } from "react";
import { useToast } from "@chakra-ui/react";

import {
  getFactoryContract,
  getRouterContract,
  getWethContract,
} from "../utils/contracts";

import COINS from "../utils/constants/coins";
import * as chains from "../utils/constants/chains";
import { useWeb3React } from "@web3-react/core";
import { getSigner } from "utils";
import { JsonRpcProvider, JsonRpcSigner } from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";

type Coin = {
  abbr : string,
  name : string,
  address : string;
}

interface ContractsType {
  coins : Array<Coin>,
  signer?: JsonRpcSigner ,
  router?: Contract,
  factory?: Contract,
  weth?: Contract,
}

const initialVal: ContractsType = {
  coins: []
}

export const Contracts = createContext(initialVal);

const ContractsProvider: React.FC = ({children}) => {
  const toast = useToast();

  const { chainId, library, account, active } = useWeb3React();

  const [signer, setSigner] = useState<JsonRpcSigner>();
  const [factory, setFactory] = useState<Contract>();
  const [router, setRouter] = useState<Contract>();
  const [weth, setWeth] = useState<Contract>();
  const [coins, setCoins] = useState<Array<Coin>>(COINS.get(chainId ?? 97));
  let curSigner: JsonRpcSigner;

  async function setupConnection() {
    try {
        curSigner = getSigner(library, account ?? "")
        setSigner(curSigner);
        // Set chainID
        if (chains.networks.includes(chainId as number)) {

          // Get the router using the chainID
          setRouter(await getRouterContract(
            chains.routerAddress.get(chainId),
            curSigner as JsonRpcSigner
          ));
          
        } else {
          console.log("Wrong network");
          toast({
            title: 'Error.',
            description: "Connected to unsupported chain.",
            status: 'error',
            duration: 6000,
            isClosable: true,
          })
        }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (active)
      setupConnection()
        .then(() => { console.log("Setup network")})
        .catch(() => { console.log("Network setup failed")})
    setCoins(COINS.get(chainId))
  },[account])

  // setup factory and weth when router is setup
  useEffect(() => {
      if (router && signer){
        console.log("UPDATING...")
        // Get Weth address from router
        router!.WETH().then((wethAddress: string) => {
          setWeth(getWethContract(wethAddress, signer as JsonRpcSigner));

          // Set the value of the weth address in the default coins array
          coins[0].address = wethAddress;
        });
        
        // Get the factory address from the router
        router!.factory().then((factory_address: string) => {
          setFactory(getFactoryContract(
            factory_address,
            signer as JsonRpcSigner
          ));
        });
      } 
  },[router, signer])

  useEffect(() => {
    setupConnection();
  },[])

  return (
    <Contracts.Provider value={{signer, factory, router, coins, weth}}>
      {children}
    </Contracts.Provider>
  )

};

export default ContractsProvider;