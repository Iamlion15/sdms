import express from 'express';
import agroRoutes from './routes/agro/agroRoutes';
import farmerRoutes from './routes/farmer/farmerRoutes';
import rabRoutes from './routes/rab/rabRoutes';
import adminRoute from './routes/admin/adminRoute';
import dbConnect from './database/db';
import cors from 'cors';
const app=express();
dbConnect();
app.use(cors({origin:"*"}))
app.use(express.json()); 
app.use("/api/agro",agroRoutes)
app.use("/api/farmer",farmerRoutes)
app.use("/api/rab",rabRoutes)
app.use("/api/rab",rabRoutes)
app.use("/api/admin",adminRoute)

export default app;