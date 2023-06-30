import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import seedRouter from './routes/seedRoutes.js';
import productRouter from './routes/productRoutes.js';
import userRouter from './routes/userRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import uploadRouter from './routes/uploadRoutes.js';
// import paymentRoute from './routes/PaymentRoutes.js';
import Razorpay from 'razorpay'
import cors from 'cors'

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to db');
  })
  .catch((err) => {
    console.log(err.message);
  });

const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/keys/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});
app.get('/api/keys/google', (req, res) => {
  res.send({ key: process.env.GOOGLE_API_KEY || '' });
});

app.get('/api/getrazorpaykey', (req, res) => {
  res.status(200).json({key: process.env.RAZORPAY_API_KEY_ID})
})

// app.get('/api/getpayment', (req, res) => {
//   res.status(200).json({order_id: razorpay_order_id, payment_id: razorpay_payment_id, signature: razorpay_signature,})
// })

app.use('/api/upload', uploadRouter);
app.use('/api/seed', seedRouter);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
// app.use('/api/', paymentRoute);

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

// //RAZORPAY
// export const instance = new Razorpay({
//   key_id: process.env.RAZORPAY_API_KEY_ID,
//   key_secret: process.env.RAZORPAY_API_KEY_SECRET,
// });
// //RAZORPAY

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '/frontend/public')));
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/frontend/public/index.html'))
);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});
