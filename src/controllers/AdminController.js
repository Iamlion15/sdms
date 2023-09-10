import userModel from "../models/personModel";
import checkCredentials from "../helpers/checkCredentials";
import generateToken from "../helpers/tokenGenerator";
import stockModel from "../models/stockModel";
import transactionModel from "../models/transactionModel";
import { hashPassword } from "../helpers/hash_match_password";

class AdminController {
    static async login(req, res) {
        try {
            const isValid = await checkCredentials(req.body.email, req.body.password);
            if (isValid) {
                const token = await generateToken(req.body.email);
                const person = await userModel.findOne({ email: req.body.email })
                if (person.role == "ADMIN") {
                    res.status(200).json({ role: "ADMIN", "token": token });
                }
                else {
                    res.status(200).json({ message: "not registered ADMIN" });
                }
            }
            else {
                res.status(200).json({ "message": "invalid credentials" });
            }
        } catch (error) {
            res.status(500).json({ error })
        }
    }
    static async createRABUser(req, res) {
        const user = new userModel({ ...req.body, role: "RAB", password: await hashPassword(req.body.password) });
        try {
            const data = await user.save();
            res.status(200).json({ "message": "successfully saved RAB USER AGENT" })
        }

        catch (error) {
            if (error.code === 11000) {
                res.status(405).json({ "message": "nid,email,or phone might be used" });
            }
            else {
                res.status(400).json(error.message);
                console.log(error);
                console.log(error.code);
            }
        }
    }
    static async updateUser(req, res) {
        const user = await userModel.findOne({ _id: req.body._id });
        console.log(user)
        try {
            const data = await userModel.findOneAndUpdate(user._id, req.body);
            res.status(200).json({ "message": "successfully updated" })
        } catch (error) {
	console.log(error)
            res.status(400).json(error.message);
        }
    } 

    static async deleteUser(req, res) {
        const user = await userModel.findOne({ _id: req.body._id });
        try {
            const data = await userModel.findOneAndDelete(user._id, req.body);
            res.status(200).json({ "message": "successfully deleted" })
        } catch (error) {
            res.status(400).json(error.message);
            console.log(error)
        }
    }


    static async getFarmers(req, res) {
        try {
            // Fetch all documents from the collection
            const data = await userModel.find({role:"FARMER"})
            res.status(200).json(data);
        } catch (error) {
            res.status(400).json(error.message);
        }
    }

    static async getAgro(req, res) {
        try {
            // Fetch all documents from the collection
            const data = await userModel.find({role:"AGRO"})
            res.status(200).json(data);
        } catch (error) {
            res.status(400).json(error.message);
        }
    }
    static async getRAB(req, res) {
        try {
            // Fetch all documents from the collection
            const data = await userModel.find({role:"RAB"})
            res.status(200).json(data);
        } catch (error) {
            res.status(400).json(error.message);
        }
    }

}

export default AdminController