"use client"

import { useRouter } from "next/navigation"



export default function BackToEventsButton (){
    const router = useRouter()
    return (
        <button className="flex bg-white p-5 rounded-xl" onClick={()=>router.back()}>Back to Events</button>
    )
}