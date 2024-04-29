import { Numbers } from "web3";


export type GetEventDTO = {
    id: string;
    _name:String,
    _location:String,
    _date:String,
    _time:String,
    tickets:String,
    maxTickets:String,
    price:Numbers

}

export type CreateEventDTO = {
    title:String,
    location:String,
    dateTime:String,
    seats:Number,
    price:Number
}