import userModel from "../models/personModel";
import checkCredentials from "../helpers/checkCredentials";
import generateToken from "../helpers/tokenGenerator";
import stockModel from "../models/stockModel";
import transactionModel from "../models/transactionModel";
import { hashPassword } from "../helpers/hash_match_password";

class farmerController {
    static async login(req, res) {
        try {
            const isValid = await checkCredentials(req.body.email, req.body.password);
            if (isValid) {
                const token = await generateToken(req.body.email);
                const person = await userModel.findOne({ email: req.body.email })
                if (person.role == "FARMER") {
                    res.status(200).json({ role: "FARMER", "token": token });
                }
                else {
                    res.status(200).json({ message: "not registered farmer" });
                }
            }
            else {
                res.status(200).json({ "message": "invalid credentials" });
            }
        } catch (error) {
            res.status(500).json({ error })
        }
    }
    static async signup(req, res) {
        const user = new userModel({ ...req.body, role: "FARMER", password: await hashPassword(req.body.password) });
        try {
            const data = await user.save();
            res.status(200).json({ "message": "successfully saved" })
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

    static async getAgroStock(req, res) {
        try {
            // Fetch all documents from the collection
            const allStock = await stockModel.find().populate('seed').populate('owner');
            // Filter the results to find documents where 'owner.role' is 'RAB'
            const filteredStock = allStock.filter(item => item.owner.role === 'AGRO');
            res.status(200).json(filteredStock);
        } catch (error) {
            res.status(400).json(error.message);
        }
    }

    static async getStock(req, res) {
        try {
            // Fetch all documents from the collection
            const allStock = await stockModel.find({owner:req.user._id}).populate('seed')
            res.status(200).json(allStock);
        } catch (error) {
            res.status(400).json(error.message);
        }
    }
    static async getTransactions(req, res) {
        try {
            // Fetch all documents from the collection
            const allTrans = await transactionModel.find().populate('requestedBy').populate('requestedFrom')
            res.status(200).json(allTrans);
        } catch (error) {
            res.status(400).json(error.message);
        }
    }

    static async requestSeedFromAgrodealer(req, res) {
        try {
            const AgrodealerStock = await stockModel.findOne({ seed: req.body.seed, owner: req.body.requestedFrom })
            const newQuantity = AgrodealerStock.quantity - Number(req.body.quantity)
            AgrodealerStock.quantity = newQuantity;
            const FarmerStock = await stockModel.findOne({ seed: req.body.seed, owner: req.user._id })
            if (FarmerStock == null) {
                try {
                    const pricee = req.body.amount / req.body.quantity
                    const stock = new stockModel({
                        quantity: req.body.quantity,
                        price: pricee.toFixed(2),
                        seed: req.body.seed,
                        owner: req.user._id
                    });
                    if (newQuantity == 0) {
                        await stock.save();
                        await stockModel.findOneAndDelete(AgrodealerStock._id, AgrodealerStock)
                    }
                    else if (newQuantity > 0) {
                        await stock.save();
                        await stockModel.findOneAndUpdate(AgrodealerStock._id, AgrodealerStock);
                    }
                    else {
                        if (newQuantity < 0) {
                            throw new error("insufficient stock")
                        }
                    }
                }
                catch (error) {
                    console.log(error)
                    throw error;
                }
            }
            else {
                try {
                    const newFarmerQuantity = FarmerStock.quantity + Number(req.body.quantity)
                    FarmerStock.quantity = newFarmerQuantity;
                    if (newQuantity == 0) {
                        await stockModel.findOneAndUpdate(FarmerStock._id, FarmerStock);
                        await stockModel.findOneAndDelete(AgrodealerStock._id, AgrodealerStock)
                    }
                    else if (newQuantity > 0) {
                        await stockModel.findOneAndUpdate(FarmerStock._id, FarmerStock);
                        await stockModel.findOneAndUpdate(AgrodealerStock._id, AgrodealerStock);
                    }
                    else {
                        if (newQuantity < 0) {
                            throw new error("insufficient stock")
                        }
                    }

                } catch (error) {
                    console.log(error)
                    throw error;
                }
            }
            try {
                const transaction = new transactionModel({ ...req.body, requestedFrom: req.body.requestedFrom, status: "fulfilled" })
                await transaction.save();
                res.status(200).json({ "message": "successfully filled the order" })
            } catch (error) {
                console.log(error)
                throw error;
            }
        } catch (error) {
            console.log(error)
            res.status(400).json(error)
        }
    }
}

export default farmerController