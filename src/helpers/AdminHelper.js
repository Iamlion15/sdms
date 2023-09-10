import userModel from "../models/personModel";
import { hashPassword } from "./hash_match_password";
import dbConnect from '../database/db';
dbConnect();
const createADMINUser = async (firstnam, lastnam, NID, emaill, phonee, password) => {
    try {
        const existingUser = await userModel.findOne({ email: emaill });
        if (!existingUser == null) {
            console.log("RAB user already exists")
        }
        else {
            const hpass = await hashPassword(password);
            const RABUser = new userModel({
                firstname: firstnam,
                lastname: lastnam,
                nID: NID,
                email: emaill,
                phone: phonee,
                password: hpass,
                role: "ADMIN"
            })
            await RABUser.save()
            console.log("saved administrator sucessfully")
        }
    } catch (error) {
        console.log(error)
    }
}

const fname = process.argv[2];
const lname = process.argv[3];
const natid = process.argv[4];
const em = process.argv[5];
const ph = process.argv[6];
const pas = process.argv[7];

createADMINUser(fname, lname,natid,em,ph,pas);