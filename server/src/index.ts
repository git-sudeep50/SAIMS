import express, { Request, Response } from 'express';
import authRouter from './routes/auth.routes';
import adminRouter from './routes/admin.routes';
import advisorRouter from './routes/courseAdvisor.routes';
import instructorRouter from './routes/courseInstructor.routes';
import { authorizeRoles } from './middlewares/access.middlewares';
import studentRouter from './routes/student.routes';
import { createClient } from "redis";
import * as dotenv from 'dotenv';
dotenv.config();
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());

// Connect Redis Client Properly
export const redisClient = createClient();

redisClient.on('error', (err) => {
    console.error('Redis Client Error', err);
});

redisClient.connect().then(() => {
    console.log('Redis Client Connected');
}).catch((err) => {
    console.error('Failed to Connect Redis', err);
});

app.get('/api', (req: Request, res: Response) => {
    res.status(200).json({
        msg: "Welcome to Student Dashboard"
    })
});

app.use('/api/auth', authRouter);
app.use('/api/admin', authorizeRoles("ADMIN"), adminRouter);
app.use('/api/student', studentRouter);
app.use('/api/advisor', advisorRouter);

// Use a Default Port in Case of Missing Env
const PORT = process.env.SERVER_PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(Date());
});
