import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import productRouter from 'routes/product'
import orderRouter from 'routes/order'
import errorHandler from 'middlewares/error-handler';
import NotFoundError from 'errors/not-found-error';
import { errors } from 'celebrate';
import { errorLogger, requestLogger } from 'middlewares/logger';
import path from 'path';


const app = express();
const { PORT = 3000, DB_ADDRESS = "mongodb://" } = process.env;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
mongoose.connect(DB_ADDRESS)

app.use(requestLogger)

app.use('/product', productRouter)
app.use('/order', orderRouter)
app.use('*', (req, res, next) => {
  next(new NotFoundError())
})

app.use(errorLogger)
app.use(errors())
app.use(errorHandler);


app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});