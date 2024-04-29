import Image from "next/image";
export default function TicketCard({ ticket }: { ticket: any }) {
  return (
    <div className="flex flex-col bg-blue-300 p-2 rounded-md">
      <h3 className="text-xl text-white text-center">{ticket.metadata.name}</h3>

      <p className="text-white text-center">{ticket.metadata.keyvalues.date}</p>
      <p className="text-white text-center">{ticket.metadata.keyvalues.time}</p>
      <p className="text-white text-center">
        {ticket.metadata.keyvalues.location}
      </p>
      <p className="text-white text-center">
        {"Seat:" + ticket.metadata.keyvalues.seat}
      </p>

      <Image
        src={
          "https://blue-historical-tapir-536.mypinata.cloud/ipfs/" +
          ticket.ipfs_pin_hash
        }
        alt="QR code"
        width="200"
        height="200"
        priority
      />
    </div>
  );
}
