
const checkAGROAuthorization=(req,res,next)=>{
    try {
        if(req.user.role=="AGRO"){
            next()
        }
        else
        {
            res.status(400).json({"message":"no authorization"})
        }
    } catch (error) {
        res.status(400).json({"message":"no authorization"})
    }    
}

const checkRABAuthorization=(req,res,next)=>{
    try {
        if(req.user.role=="RAB"){
            next()
        }
        else
        {
            res.status(400).json({"message":"no authorization"})
        }
    } catch (error) {
        res.status(400).json({"message":"no authorization"})
    }    
}

const checkFarmerAuthorization=(req,res,next)=>{
    try {
        if(req.user.role=="FARMER"){
            next()
        }
        else
        {
            res.status(400).json({"message":"no authorization"})
        }
    } catch (error) {
        res.status(400).json({"message":"no authorization"})
    }    
}
const checkAdminAuthorization=(req,res,next)=>{
    try {
        if(req.user.role=="ADMIN"){
            next()
        }
        else
        {
            res.status(400).json({"message":"no authorization"})
        }
    } catch (error) {
        res.status(400).json({"message":"no authorization"})
    }    
}

export {
    checkAGROAuthorization,
    checkRABAuthorization,
    checkFarmerAuthorization,
    checkAdminAuthorization
}