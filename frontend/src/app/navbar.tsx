"use client";
import { useContext } from "react";
import { BlockchainProvider } from "./providers/blockchain.provider";


export default function NavBar() {
  const context:any = useContext(BlockchainProvider);

  const withdrawFundsHandler = async ()=>{
    const balance_prev = await context.web3.eth.getBalance(context.contract.options.address)
    console.log(balance_prev)
    const owner = context.contract.methods.owner().call({from:context.account});
    const tx = await context.contract.methods.withdrawFunds().send({from:owner})
    console.log(tx)
    const balance_post = await context.web3.eth.getBalance(context.contract.options.address)
    console.log(balance_post)
  }
  const connectHandler = async () => {
    const accts = await (window as any).ethereum.request({
      method: "eth_requestAccounts",
    });
    context.setAccount(accts[0]);
    
  };

  return (
    <nav className="navbar">
      <div>
        {
          context.account ? ( <button className="navbar-logo" >
          Account:{" "}
          {context.account
            ? context.account.slice(0, 8) + "..." + context.account.slice(40, 42)
            : "Connect"}
        </button>) : <button className="navbar-logo" onClick={connectHandler}>
          Account:{" "}
          {context.account
            ? context.account.slice(0, 8) + "..." + context.account.slice(40, 42)
            : "Connect"}
        </button>
        }
      </div>
      {context.owner && context.account && context.owner.toUpperCase() === context.account.toUpperCase() && <button className="navbar-logo" onClick={withdrawFundsHandler}>Withdraw Funds</button>}
    </nav>
  );
}
