"use client"

import { useContext } from "react"
import { useRouter } from 'next/navigation';
import { BlockchainProvider } from "../providers/blockchain.provider";


export default function AddEventForm (){
  const context:any = useContext(BlockchainProvider)
  const router = useRouter()

  const handleSubmit = async(data:FormData)=>{
    

    const name = data.get('name')
    const price = data.get('price')
    const date = data.get('date')
    const time = data.get('time')
    const location = data.get('location')
    const tickets = data.get('tickets')
    const user = data.get('user')
    
   
    await context.contract.methods.createEvent(name,price,date,time,location,tickets).send({from:context.owner})
    router.refresh()
}
  

    return (
     <>
     {context.owner && context.account && context.owner.toUpperCase() === context.account.toUpperCase() &&
           <form className="flex flex-col p-5 w-60" action={handleSubmit}>
           <input type="text" name="name" placeholder="Event Name" className="p-5"/>
           <input type="date" name="date" placeholder="Date" className="p-5"/>
           <input type="time" name="time" placeholder="Time"className="p-5"/>
           <input type="text" name="location" placeholder="Location" className="p-5"/>
           <input type="number" name="price" placeholder="Price" className="p-5"/>
           <input type="number" name="tickets" placeholder="Tickets" min={0} className="p-5"/>
            <input type="hidden" name="user" value={context.account}/>
           <button className="bg-white p-5">Add Event</button>
         </form>
     }
     </>
    )
}