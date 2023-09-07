import express from 'express'
import agrodealerController from '../../controllers/agrodealerController'
import checkAuth from '../../middlewares/checkAuthentication'
import {checkAGROAuthorization} from '../../middlewares/checkAuthorization'

const router=express.Router()

router.post("/signup",agrodealerController.signup)
router.post("/login",agrodealerController.login)
router.post("/requestseed",checkAuth,checkAGROAuthorization,agrodealerController.requestSeedFromRAB)
router.get("/getstock",checkAuth,checkAGROAuthorization,agrodealerController.getStock)
router.get("/getmystock",checkAuth,checkAGROAuthorization,agrodealerController.getMyStock)


export default router;  
