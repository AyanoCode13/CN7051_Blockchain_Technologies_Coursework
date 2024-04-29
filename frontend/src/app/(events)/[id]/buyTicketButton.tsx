"use client"

import { BlockchainProvider } from "@/app/providers/blockchain.provider"
import { createQR } from "@/app/utils/server.functions"
import { getWeb3 } from "@/app/utils/web3"
import { GetEventDTO } from "@/types/event.dto"
import { useRouter } from "next/navigation"
import { useContext } from "react"
import { PiArmchairFill } from "react-icons/pi"



export default function BuyTicketButton ({event, seat, taken}:{event:GetEventDTO, seat:number, taken:boolean}) {
    const context:any = useContext(BlockchainProvider)
    const router = useRouter()

    const handleBuyTicket = async ()=>{
       const event_id = Number(event.id.toString())
       const converted_to_wei = context.web3.utils.fromWei(event.price,"ether")

      
        try {
            const { IpfsHash } = await createQR({event:event, seat:(seat-1), owner:context.account, path:"./public/"+event._name+event_id+"E"+(seat-1)+".png", url: "https://localhost:3000"})
            const metadataUri = event_id+seat+IpfsHash
            const res = await context.contract.methods.buyTicket(event_id,seat-1,metadataUri).send({from:context.account, value:context.web3.utils.toWei(converted_to_wei,"ether"), gas:"2900000" })            
        
        } catch (error) {
            console.log(error)
        }
        router.refresh()
        
    }
    
    return (
        <>
        {taken ? <button className="text-xl p-3 text-white bg-red-950 rounded-full" disabled><PiArmchairFill /></button> : <button className="text-xl p-3 text-white bg-blue-950 rounded-full" onClick={handleBuyTicket}><PiArmchairFill /></button>}
        </>
    )
} 