import express, { Request, Response } from "express";
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import myUserRoute from './routes/MyUserRoutes';

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string)
    .then(() => { console.log('connected to database ') });
    



const app = express();

app.use(express.json());
app.use(cors());
// app.use((req, res, next) => {
//     console.log(req.url);
//     next();
// })


app.get('/health', async (req: Request, res: Response) => {
    res.send({ message: "health ok!" });
});

app.use("/api/my/user", myUserRoute);

app.get('/test', (req, res) => {
    res.json({message: 'Hello World'});
});

app.listen(7000, () => {
    console.log('server is started at localhost : 7000')
});

//Nu09WidwLfkNPb4R

//mongodb+srv://anshulmakhija125:Nu09WidwLfkNPb4R@food-ordering-platform.8q2jdfh.mongodb.net/?retryWrites=true&w=majority&appName=food-ordering-platform