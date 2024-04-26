const { expect } = require("chai");
const hre = require("hardhat");

const SYMBOL = "NFTK"
const NAME = "NFTicket"



//Write a test that verifies that the NFTicket contract is deployed with the right parameters.
describe("NFTicket", function () {
    let nft, deployer, customer;
    
    beforeEach(async () => {
        const [owner, addr1] = await hre.ethers.getSigners();
        deployer = owner
        customer = addr1
        
        const NFTicket = await hre.ethers.getContractFactory("NFTicket");
        nft = await NFTicket.deploy(NAME,SYMBOL);
       
        await nft.waitForDeployment();
        const transaction = await nft.connect(owner).createEvent(
            "Flow Concert",
            hre.ethers.parseUnits("1","ether"),
            "2025-12-12",
            "10:00PM CST",
            "Tokyo, JPN",
            100
        );
        const transaction2 = await nft.connect(owner).createEvent(
            "Wrestlemania",
            hre.ethers.parseUnits("0.5","ether"),
            "2024-10-18",
            "10:00PM CST",
            "New York, USA",
            200
        );
        await transaction.wait();
        await transaction2.wait();


    });
    describe("Deployment", function () {
        it("Should return the right name and symbol", async function () {
            expect(await nft.name()).to.equal(NAME);
            expect(await nft.symbol()).to.equal(SYMBOL);
        });
    });
    describe("Event Creation", function () {
      it("check if the total tickets has been increased", async function () {
        expect(await nft.totalEvents()).to.equal(2);
      })
    });

    describe("Event View", function () {
       
        it("returns all the events", async function () {
            const events = await nft.viewAllEvents();
            expect(events.length).to.equal(2);
        })
        it("returns the event details", async function () {
            const event = await nft.viewEvent(0);
            expect(event._name).to.equal("Flow Concert");
            expect(event.price).to.equal(hre.ethers.parseUnits("1","ether"));
            expect(event._date).to.equal("2025-12-12");
            expect(event._time).to.equal("10:00PM CST");
            expect(event._location).to.equal("Tokyo, JPN");
            expect(event.maxTickets).to.equal(100);

            const event2 = await nft.viewEvent(1);
            expect(event2._name).to.equal("Wrestlemania");
            expect(event2.price).to.equal(hre.ethers.parseUnits("0.5","ether"));
            expect(event2._date).to.equal("2024-10-18");
            expect(event2._time).to.equal("10:00PM CST");
            expect(event2._location).to.equal("New York, USA");
            expect(event2.maxTickets).to.equal(200);

        })
    })
    describe("Purchase Ticket", async function(){
      const ID=0
      const SEAT=80
      const AMOUNT = hre.ethers.parseUnits("1","ether")

      beforeEach(async ()=>{
        const transaction =  await nft.connect(customer).buyTicket(ID, SEAT,{ value: AMOUNT });
        await transaction.wait()
      })
      it("Updates the number of the tickets available", async ()=>{
        const listedEvent = await nft.viewEvent(0)
        expect(listedEvent.tickets).to.equal(99)
      })
      it("Updated the purchase status", async ()=>{
        const status = await nft.hasPurchased(ID, customer.address)
        expect(status).to.be.equal(true)
      })
      it("Updates the seat status", async ()=>{
        const seat_owner = await nft.seatTaken(ID, SEAT)
        expect(seat_owner).to.equal(customer.address)
      
      })
      it("Updates the global seat status", async ()=>{
        const seats = await nft.getSeatsTaken(ID)
        expect(seats.length).to.equal(1)
        expect(seats[0]).to.equal(SEAT)
      })
      it("Updated the contract balance", async function () {
        const contractBalance = await hre.ethers.provider.getBalance(await nft.getAddress());
        expect(contractBalance).to.equal(hre.ethers.parseUnits("1","ether"));
      });
    })
    describe("Withdraw", async function () {
        let customerBalance;
        beforeEach(async () => {
            customerBalance = await hre.ethers.provider.getBalance(customer.address);
            const transaction =  await nft.connect(customer).buyTicket(0, 81, { value: hre.ethers.parseUnits("1","ether") });
            await transaction.wait();
        })

        it("Updated the contract balance", async function () {
          const contract_address = await nft.getAddress()
          const contractBalance = await hre.ethers.provider.getBalance(contract_address);
          expect(contractBalance).to.equal(hre.ethers.parseUnits("1","ether"));
        });
        
        it("Updated the customer balance", async function () {
            const customerBalanceUpdated = await hre.ethers.provider.getBalance(customer.address);
            expect(customerBalanceUpdated).to.be.lessThan(customerBalance);
        });

        it("Updated the owner balance", async function () {
            const ownerBalance = await hre.ethers.provider.getBalance(deployer.address);
            const transaction =  await nft.connect(deployer).withdrawFunds();
            await transaction.wait();
            const ownerBalanceUpdated = await hre.ethers.provider.getBalance(deployer.address);
            expect(ownerBalanceUpdated).to.be.greaterThan(ownerBalance);
        })
    })
});
