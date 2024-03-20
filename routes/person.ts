import express, {Request, Response, NextFunction} from "express";
const router = express.Router();
import pool from '../db/db';

router.get('/', async (req: Request, res: Response) => {
    try {
        const { rows } = await pool.query('SELECT * FROM person');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
})

export default router;