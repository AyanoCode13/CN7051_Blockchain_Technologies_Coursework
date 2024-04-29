import Web3, { ContractAbi, SupportedProviders } from "web3";

export const getWeb3 = ({provider}:{provider:SupportedProviders}) =>{
    return new Web3(provider);
}
export const getContract = ({web3, abi, address}:{web3:Web3, abi:ContractAbi, address:string})=>{
    return new web3.eth.Contract(abi, address);
}