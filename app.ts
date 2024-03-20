import express, { Request, Response, NextFunction } from "express";
import createError from 'http-errors';

import todoRouter from './routes/todo'
import userRouter from './routes/person'

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/todos', todoRouter);
app.use('/user', userRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
    next(createError(404));
})

app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    res.status(err.status || 500).send({ message: err.message });
})

export default app;