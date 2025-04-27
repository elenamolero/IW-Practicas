//import app from './index.js'
import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from "./routes/auth.routes.js";
import groupClassRoutes from "./routes/groupClass.routes.js";
import workoutRoutes from "./routes/workout.routes.js";
import invoiceRoutes from "./routes/invoice.routes.js";
import muscleRoomRoutes from "./routes/muscleRoom.routes.js";
import muscleRoomReserveRoutes from "./routes/muscleRoomReserve.routes.js";
import cors from 'cors';


const app=express();

app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api',authRoutes);
app.use('/api',groupClassRoutes);
app.use('/api',workoutRoutes);
app.use('/api',invoiceRoutes);
app.use('/api',muscleRoomRoutes);
app.use('/api',muscleRoomReserveRoutes);

export default app;
//app.listen(3000)
//console.log('Server on port',3000)