import { Request, Response } from 'express';
import pool from '../db/db';

export const getAllTodos = async (req: Request, res: Response) => {
    try {
        const { rows } = await pool.query('SELECT * FROM todos');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
}