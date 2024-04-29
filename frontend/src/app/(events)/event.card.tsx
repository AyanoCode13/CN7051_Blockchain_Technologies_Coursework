import { GetEventDTO } from "@/types/event.dto";
import Link from "next/link";

export default function EventCard(event:GetEventDTO){
    return (
        <li className="card">
            <h2 className="card-title">{event._name}</h2>
            <p>Date: {event._date}</p>
            <p>Location: {event._location}</p>
            <p>Price: {event.price}</p>
            <Link href={"/"+ event.id}><button className="p-3 m-3 flex items-center bg-blue-950 rounded-xl">View</button></Link>
        </li>
    )
}