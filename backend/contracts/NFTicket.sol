// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";



contract NFTicket is ERC721, ERC721URIStorage, Ownable {
    uint256 private nextEvent_id;
    uint256 private nftSupply;

    
    constructor(string memory name, string memory symbol ,address owner)
        ERC721(name, symbol)
        Ownable(owner)
    {}
     function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
   

    struct ListedEvent{
        uint256 id;
        string _name;
        uint256 price;
        string _date;
        string _time;
        string _location;
        uint256 tickets;// The amount of tickets that have been sold
        uint256 maxTickets; // The maximum number of tickets that can be sold
        
    }

    mapping(uint256 => ListedEvent) private listedEvents;
    mapping(uint256=>mapping(uint256=>address)) public seatTaken;
    mapping(uint256=>uint256[]) private seatsTaken;
    mapping(uint256=>mapping(address=>bool)) public hasPurchased;



    function createEvent(string memory _name, uint256 _price, string memory _date, string memory _time, string memory _location, uint256 _maxTickets) public onlyOwner(){
        listedEvents[nextEvent_id] = ListedEvent(nextEvent_id, _name, _price, _date, _time, _location, _maxTickets, _maxTickets);
        nextEvent_id++;
       
    }
    function buyTicket(uint256 _id, uint256 _seat, string memory metadataUri ) public payable returns (uint256){
        //Check if the event exists
        require(_id >= 0, "Event does not exist");
        require(_id <= nextEvent_id, "Event does not exist");
        //Check that the ETH amount is equal or greater than the price of the ticket
        require(msg.value >= listedEvents[_id].price, "Insufficient funds");
        //Check that the seat is not taken and the seat exists
        require(seatTaken[_id][_seat] == address(0), "Seat is taken");
        require(_seat < listedEvents[_id].maxTickets, "Seat does not exist");
        hasPurchased[_id][msg.sender] = true;
        seatTaken[_id][_seat] = msg.sender;
        seatsTaken[_id].push(_seat);
        listedEvents[_id].tickets--;
        nftSupply++;
        _safeMint(msg.sender, nftSupply);
        _setTokenURI(nftSupply, metadataUri);

        return nftSupply;
       
    }

    //A function that allows the owner of the NFT to withdraw the funds from the sale of the tickets
    function withdrawFunds() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function getSeatsTaken(uint256 _id) public view returns (uint256[] memory){
        return seatsTaken[_id];
    }
   
    //Create a function that returns an event
    function viewEvent(uint256 _id) public view returns (ListedEvent memory) {
        return listedEvents[_id];
    }
    
    //Create a function that lists all the events
    function viewAllEvents() public view returns (ListedEvent[] memory) {
        ListedEvent[] memory events = new ListedEvent[](nextEvent_id);
        for (uint256 i = 0; i < nextEvent_id; i++) {
            events[i] = listedEvents[i];
        }
        return events;
    }
    //Create a function that returns the total number of events
    function totalEvents() public view returns (uint256) {
        return nextEvent_id;
    }   
    
}