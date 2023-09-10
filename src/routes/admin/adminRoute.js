import express from 'express'
import AdminController from '../../controllers/AdminController'
import checkAuth from '../../middlewares/checkAuthentication'
import {checkAdminAuthorization} from '../../middlewares/checkAuthorization'


const router=express.Router()

router.post("/login",AdminController.login)
router.get("/getrab",checkAuth,checkAdminAuthorization,AdminController.getRAB)
router.get("/getfarmers",checkAuth,checkAdminAuthorization,AdminController.getFarmers)
router.get("/add",checkAuth,checkAdminAuthorization,AdminController.createRABUser)
router.get("/getagro",checkAuth,checkAdminAuthorization,AdminController.getAgro)
router.post("/update",checkAuth,checkAdminAuthorization,AdminController.updateUser)
router.delete("/delete",checkAuth,checkAdminAuthorization,AdminController.deleteUser)

export default router;  
