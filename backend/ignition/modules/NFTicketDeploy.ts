// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

const tokenConverter = (n:Number) =>{
  return hre.ethers.parseUnits(n.toString(), "ether");
}


async function main() {
  
  const [deployer, deployer2] = await hre.ethers.getSigners();
  console.log(deployer2);
  const NAME = "NFTicket";
  const SYMBOL = "NFTK"


  const nft = await hre.ethers.getContractFactory(NAME);
  const nftContract = await nft.deploy(NAME, SYMBOL, deployer2);
  await nftContract.waitForDeployment()
  console.log("NFTicket deployed to:", await nftContract.getAddress());


  const events = [
    {
      name:"Flow Concert",
      price:tokenConverter(1),
      date:"2025-12-12",
      time:"10:00PM CST",
      location:"Tokyo, JPN",
      maxTickets:100

    },
    {
      name:"Wrestlemania",
      price:tokenConverter(2),
      date:"2024-10-18",
      time:"10:00PM CST",
      location:"New York, USA",
      maxTickets:200
    },
    {
        name:"The Weekend Concert",
        price:tokenConverter(3),
        date:"2024-10-18",
        time:"10:00PM CST",
        location:"Los Angeles, USA",
        maxTickets:200
    }
  ]

  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    const transaction = await nftContract.connect(deployer2).createEvent(
      event.name,
      event.price,
      event.date,
      event.time,
      event.location,
      event.maxTickets
    );
    await transaction.wait();
  }
  const all_events = await nftContract.connect(deployer).viewAllEvents();
    console.log(all_events)

  console.log(await nftContract.owner())

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
