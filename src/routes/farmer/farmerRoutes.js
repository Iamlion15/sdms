import express from 'express';
import farmerController from '../../controllers/farmerController';
import checkAuth from '../../middlewares/checkAuthentication'
import {checkFarmerAuthorization} from '../../middlewares/checkAuthorization'

const router=express.Router();

router.post('/signup',farmerController.signup)
router.post('/login',farmerController.login)
router.post("/requestseed",checkAuth,checkFarmerAuthorization,farmerController.requestSeedFromAgrodealer)
router.get("/getdealerstock",checkAuth,checkFarmerAuthorization,farmerController.getAgroStock)
router.get("/getstock",checkAuth,checkFarmerAuthorization,farmerController.getStock)
router.get("/gettransactions",checkAuth,checkFarmerAuthorization,farmerController.getTransactions)



export default router;