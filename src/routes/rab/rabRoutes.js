import express from 'express'
import RABController from '../../controllers/RABController'
import checkAuth from '../../middlewares/checkAuthentication'
import {checkRABAuthorization} from '../../middlewares/checkAuthorization'

const router=express.Router()

router.post("/login",RABController.login)
router.post("/addStock",checkAuth,checkRABAuthorization,RABController.addstock)
router.post("/increasestock",checkAuth,checkRABAuthorization,RABController.increaseStock)
router.post("/decreasestock",checkAuth,checkRABAuthorization,RABController.decreaseStock)
router.get("/getstock",checkAuth,checkRABAuthorization,RABController.getStock)
router.get("/gettrans",checkAuth,checkRABAuthorization,RABController.getTransactions)
router.post("/getseeds",checkAuth,checkRABAuthorization,RABController.getSeeds)



export default router;
