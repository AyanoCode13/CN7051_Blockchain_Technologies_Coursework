import { getContract, getWeb3 } from "@/app/utils/web3";
import abi from "../../../artifacts/contracts/NFTicket.sol/NFTicket.json";
import { GetEventDTO } from "@/types/event.dto";
import BuyTicketButton from "./buyTicketButton";
import BackToEventsButton from "./backToEventsButton";

export default async function EventPage({
  params,
}: {
  params: { id: string };
}) {
  const web3 = getWeb3({ provider: process.env.NEXT_PUBLIC_CONTRACT_SERVER! });
  const contract = getContract({
    web3: web3,
    abi: abi.abi,
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
  });

  const event: GetEventDTO = await contract.methods.viewEvent(params.id).call();

  const res: String[] = await contract.methods.getSeatsTaken(params.id).call();
  const seatsTaken = res.map((seat: String) => Number(seat));

  return (
    <main className="flex flex-col justify-center items-center">
      <div className="flex flex-row w-full justify-center">
        <BackToEventsButton />
        <div className=" bg-black text-white text-center rounded-xl p-5 m-5 w-5/6">
          Screen
        </div>
      </div>

      <div className=" grid grid-cols-10 gap-3">
        {Array.from(
          { length: Number(event.maxTickets.toString()) },
          (_, i) => i
        ).map((seat) => {
          return (
            <BuyTicketButton
              key={seat}
              event={event}
              seat={seat}
              taken={seatsTaken.includes(seat)}
            />
          );
        })}
      </div>
    </main>
  );
}
