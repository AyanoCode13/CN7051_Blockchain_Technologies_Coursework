import { getContract, getWeb3 } from "../utils/web3";
import abi from "../../artifacts/contracts/NFTicket.sol/NFTicket.json"
import { GetEventDTO } from './../../types/event.dto';
import EventCard from "./event.card";
import AddEventForm from "./add-event.form";
import TicketsList from "./tickets.list";

export default async function Home() {
  const web3 = getWeb3({provider:process.env.NEXT_PUBLIC_CONTRACT_SERVER! as any})
  const contract = getContract({web3:web3, abi:abi.abi, address:process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!})
  const events:GetEventDTO[] = await contract.methods.viewAllEvents().call();
  console.log(events)
  
 
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
       <TicketsList/>
       <AddEventForm/>
       <ul className="flex flex-wrap gap-3">
       {
          events.map((event:GetEventDTO, index:number)=>{
            return (
              <EventCard key={index} {...event}/>
            )
          })
       }
       </ul>
    </main>
  );
}
