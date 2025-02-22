import dotenv from 'dotenv';
import express from 'express'
import cors from 'cors'
import connectDB from './config/db.js';
import foodRouter from './routes/food.route.js';
import userRouter from './routes/user.route.js';
import cartRouter from './routes/cart.route.js';
import orderRouter from './routes/order.route.js';

dotenv.config();

const app = express()

app.use(express.json())
app.use(cors())

connectDB();

//api endpoint
app.use('/api/food', foodRouter);
app.use('/images', express.static('uploads'))
app.use('/api/user', userRouter)
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter)

app.get('/', (req, res) => {
    res.send("Hello world");
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})