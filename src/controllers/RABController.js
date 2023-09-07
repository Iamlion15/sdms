import userModel from "../models/personModel";
import checkCredentials from "../helpers/checkCredentials";
import generateToken from "../helpers/tokenGenerator";
import stockModel from "../models/stockModel";
import seedsModel from "../models/seedsModel";
import transactionModel from "../models/transactionModel";


class RABController {
    static async login(req, res) {
        try {
            const isValid = await checkCredentials(req.body.email, req.body.password);
            if (isValid) {
                const token = await generateToken(req.body.email);
                const person = await userModel.findOne({ email: req.body.email })
                if (person.role == "RAB") {
                    res.status(200).json({ role: "RAB", "token": token });
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

static async getTransactionsInRange(req, res) {
        const { startDate, endDate } = req.body;
    
        try {
            const start = new Date(startDate);
            const end = new Date(endDate);
    
            const visitors = await transactionModel.find({
                createdAt: { $gte: start, $lte: end }
            });
    
            res.status(200).json({ visitors });
        } catch (error) {
            console.log(error);
            res.status(500).json(error.message);
        }
    }

    static async addstock(req, res) {
        try {
            const seedData = new seedsModel({
                seedname: req.body.seedname,
                detail: req.body.detail,
                manudate: req.body.manudate
            })

            const seedU = await seedData.save()
            const stock = new stockModel({
                quantity: req.body.quantity,
                price: req.body.price,
                seed: seedU._id,
                owner: req.user._id
            });
            try {
                const data = await stock.save();
                res.status(200).json({ "message": "successfully saved" })
            }
            catch (error) {
                await seedsModel.findOneAndDelete(seedU._id, seedU);
                res.status(400).json(error.message);
            }
        } catch (error) {
            res.status(400).json(error.message);
        }
    }
    static async increaseStock(req, res) {
        const stock = await stockModel.findOne({ _id: req.body._id });
        const newQuantity = stock.quantity + Number(req.body.quantity)
        stock.quantity = newQuantity;
        try {
            const data = await stockModel.findOneAndUpdate(stock._id, stock);
            res.status(200).json({ "message": "successfully updated" })
        } catch (error) {
            console.log(error)
            res.status(400).json(error.message);
        }
    }
    static async decreaseStock(req, res) {
        const stock = await stockModel.findOne({ _id: req.body._id });
        const newQuantity = stock.quantity - Number(req.body.quantity)
        stock.quantity = newQuantity;
        try {
            if (newQuantity < 0) {
                res.status(400).json({ "message": "new amount is bigger than available stock" })
            }
            else if (newQuantity == 0) {
                const data = await stockModel.findOneAndDelete(stock._id, req.body);
                res.status(201).json({ "message": "successfully deleted stock" })
            }
            else {
                const data = await stockModel.findOneAndUpdate(stock._id, stock);
                res.status(200).json({ "message": "successfully updated" })
            }
        } catch (error) {
            console.log(error)
            res.status(404).json(error.message);
        }
    }
    static async getStock(req, res) {
        try {
            // Fetch all documents from the collection
            const allStock = await stockModel.find().populate('seed').populate('owner');  
            // Filter the results to find documents where 'owner.role' is 'RAB'
            const filteredStock = allStock.filter(item => item.owner.role === 'RAB');
            res.status(200).json(filteredStock);
        } catch (error) {
            res.status(400).json(error.message);
        }
    }
 static async getTransactions(req, res) {
        try {
            // Fetch all documents from the collection
            const allTrans = await transactionModel.find().populate('requestedBy').populate('requestedFrom').populate('seed')
            res.status(200).json(allTrans);
        } catch (error) {
            res.status(400).json(error.message);
        }
    }

static async getSeeds(req, res) {
        const { startDate, endDate } = req.body;  
        try {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const seeds= await seedsModel.find({
                createdAt: { $gte: start, $lte: end }
            });
    
            res.status(200).json(seeds);
        } catch (error) {
            console.log(error);
            res.status(500).json(error.message);
        }
    }
    static async requestSeedFromRAB(req, res) {
        try {
            const RABstock = await stockModel.findOne({ seed: req.body.seed, owner: req.user._id })
            const newQuantity = RABstock.quantity - Number(req.body.quantity)
            RABstock.quantity = newQuantity;
            const AgroStock = await stockModel.findOne({ seed: req.body.seed, owner: req.body.from })
            if (AgroStock == null) {
                try {
                    const stock = new stockModel({
                        quantity: req.body.quantity,
                        price: req.body.price,
                        seed: req.body.seed,
                        owner: req.body.requestedBy
                    });
                    await stock.save();
                    await RABstock.findOneAndUpdate(RABstock._id, RABstock);
                }
                catch (error) {
                    throw error;
                }
            }
            else {
                try {
                    const newQuantity = AgroStock.quantity + Number(req.body.quantity)
                    AgroStock.quantity = newQuantity;
                    await AgroStock.findOneAndUpdate(AgroStock._id, AgroStock);
                    await RABstock.findOneAndUpdate(RABstock._id, RABstock);
                } catch (error) {
                    throw error;
                }
            }
            try {
                const transaction = new transactionModel({ ...req.body, requestedFrom: req.user._id, status: "fulfilled" })
                await transaction.save();
                res.status(200).json({ "message": "successfully filled the order" })
            } catch (error) {
                throw error;
            }
        } catch (error) {
            res.status(400).json(error)
        }

    }
}

export default RABController