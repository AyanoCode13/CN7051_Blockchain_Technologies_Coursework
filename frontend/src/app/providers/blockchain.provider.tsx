"use client";

import { createContext, useEffect, useState } from "react";
import Web3 from "web3";
import abi from "../../artifacts/contracts/NFTicket.sol/NFTicket.json";
import { getContract, getWeb3 } from "../utils/web3";
import MetamaskPage from "../(events)/metamask";

export const BlockchainProvider = createContext({});

export function BlockchainContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
    
  const [account, setAccount] = useState<string>("");
  const [owner, setOwner] = useState<any>("");
  const envoriment = window as any;
  const web3 = getWeb3({ provider: envoriment.ethereum });
  const contract = getContract({web3:web3, abi:abi.abi, address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!});
 

  useEffect(() => {
    async function onInit() {
      const accounts = await envoriment.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
      const owner = await contract.methods.owner().call();
      setOwner(owner);     
      envoriment.ethereum.on("accountsChanged", async function () {
        const accounts = await envoriment.ethereum.request({
          method: "eth_requestAccounts",
        }); // Time to reload your interface with accounts[0]!
        setAccount(accounts[0]);
         
      });
    }

    onInit();
  });
  if(!envoriment.ethereum){
    return <MetamaskPage />
  }

  return (
    <BlockchainProvider.Provider
      value={{ web3: web3, contract: contract, account: account, setAccount: setAccount, owner:owner}}
    >
      {children}
    </BlockchainProvider.Provider>
  );
}
