import Paypack from 'paypack-js'
import config from '../helpers/configEnv'

class PayController {
    static async pay(req, res, next) {
        try {
            console.log(req.body)
            Paypack.config({ client_id: process.env.client_id, client_secret: process.env.client_secret });
            const results = await Paypack.cashin({
                number: req.user.phone,
                amount: req.body.amount,
                environment: "development",
            })
            console.log(results.data)
            let count = 0;
            const targetRef = results.data.ref;
            const check = async () => {
                const eventStatusResult = await Paypack.events({ offset: 0, limit: 100 });
                console.log("---------------------first---------------------------")
                for (const transaction of eventStatusResult.data.transactions) {
                    count = count + 1;
                    if (transaction.data.ref === targetRef) {
                        console.log("====================================")
                        const result = await Paypack.transactions({ offset: 0, limit: 100 })
                        const transactions = result.data.transactions
                        console.log(transactions)
                        const isPaid = transactions.some(
                            (transaction) => transaction.ref === targetRef
                        )
                        if (isPaid) {
                            console.log("paid")
                            next()
                        } else {
                            if (count == 12) {
                                res.status(401).json({ "message": "can't process pay" })
                            }
                            else {
                                console.log("not paid")
                            }
                        }
                    }
                }
                setTimeout(check, 10000)
            }
            check();
        }
        catch (error) {
            console.log(error)
            res.status(404).json(error)
        }
    }
}

export default PayController