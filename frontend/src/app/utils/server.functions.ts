"use server"
import { GetEventDTO } from "@/types/event.dto";
import fs, { PathLike } from "fs"
const QRCode = require("qrcode");
const pinataSDK = require("@pinata/sdk");
const pinata = new pinataSDK({
    pinataApiKey: "ec39db8b90b3ca5b86f6",
    pinataSecretApiKey:"2ec3ee6eab733d22ae3a55c9a28e070ecfa7e1f34be63800b4744f53170fbc3f",
});

export const createQR = async ({event, seat, owner, path, url}:{event:GetEventDTO, seat:Number, owner:String, path:PathLike, url:String})=>{
    QRCode.toFile(
        path,
        url,
        {
          color: {
            dark: '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0'), // Black dots
            light: '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0'), // White background
          },
        },
        function (err:Error) {
          if (err) throw err;
          console.log("QR code created!");
        }
      );
      const readableStreamForFile = fs.createReadStream(path);
      const options = {
        pinataMetadata: {
          name: event._name,
          keyvalues: {
            "name": event._name,
            "seat":seat,
            "owner":owner,
            "location":event._location,
            "date":event._date,
            "time":event._time,
            
          },
          
        },
        pinataOptions: {
          cidVersion: 0,
        },
      };
      const res = await pinata.pinFileToIPFS(readableStreamForFile, options)
      return res;
}


export const getORSbyOwner = async ({owner}:{owner:String})=>{
  const {rows} = await pinata.pinList(
    {
     keyvalues: {
       "owner":owner
     }
    }
  )
  return rows
}