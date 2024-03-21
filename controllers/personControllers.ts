import { Request, Response, NextFunction } from 'express';
import pool from '../db/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import exp from "node:constants";
import {ApiError} from "../utils/ApiError";

type RegisterType = {
    name: string,
    lastname: string,
    nickname: string,
    password: any;
}

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    const { name, lastname, nickname, password }: RegisterType = req.body;

    try {
        const existingUser = await pool.query('SELECT * FROM person WHERE nickname = $1', [nickname]);
        if (existingUser.rows.length > 0) {
            throw new ApiError(409, 'Nickname already exist');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const { rows } = await pool.query(
            'INSERT INTO person (name, lastname, nickname, password) VALUES ($1, $2, $3, $4) RETURNING id, name, nickname',
            [name, lastname, nickname, hashedPassword]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        next(err);
    }
}

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    const { nickname, password } = req.body;
    console.log(req.body);

    try {
        const { rows } = await pool.query('SELECT * FROM person WHERE nickname = $1', [nickname]);
        if (rows.length === 0) {
            throw new ApiError(404, 'User not found');
        }
        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new ApiError(400, 'Invalid credentials');
        }

        const token = jwt.sign({ userId: user.id, nickname: user.nickname }, process.env.JWT_SECRET as any, { expiresIn: '1h' });
        res.json({token});
    } catch (err) {
        next(err);
    }
}
