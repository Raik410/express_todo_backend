import express, { Request, Response, NextFunction } from "express";
import createError from 'http-errors';
import helmet from "helmet";

import todoRouter from './routes/todo'
import userRouter from './routes/person'
import {ApiError} from "./utils/ApiError";

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/todos', todoRouter);
app.use('/user', userRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
    throw new ApiError(404, 'Not found');
})

app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({message: err.message});
    }

    console.error(err);

    return res.status(500).json({ message: 'An unexpected error occurred', error: err });
})

export default app;