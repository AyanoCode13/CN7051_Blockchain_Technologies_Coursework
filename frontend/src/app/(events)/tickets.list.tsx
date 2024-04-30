"use client"
import React, { useContext } from "react";
import { BlockchainProvider } from "../providers/blockchain.provider";
import { getORSbyOwner } from "../utils/server.functions";
import TicketCard from "./ticket.card";



export default function TicketsList(){
  const context:any = useContext(BlockchainProvider)

  const [tickets, setTickets] = React.useState([])
  React.useEffect(()=>{
   const getTickets = async ()=>{
    const res = await getORSbyOwner(context.account)
    setTickets(res)
   }
    getTickets()
  },[context.account])
   
    return (
    <>
        
        <h1 className="text-4xl text-white text-center">My Tickets</h1>
        <div className="flex flex-row flex-wrap gap-2 justify-center items-center mt-5">
      {
        tickets && tickets.map((ticket:any) => {
     
          return (
            <React.Fragment key={ticket.id}>
              {(context.account &&ticket.metadata.keyvalues.owner && !ticket.date_unpinned && ticket.metadata.keyvalues.owner.toUpperCase() === context.account.toUpperCase() ) && <TicketCard ticket={ticket}/>}
            </React.Fragment>
            
            
          )
        })
      }</div>
    </>
        
    )

}