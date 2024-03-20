import express, {Request, Response, NextFunction} from "express";
const router = express.Router();
import pool from '../db/db';

router.get('/', async (req: Request, res: Response) => {
    try {
        const { rows } = await pool.query('SELECT * FROM todos');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
})

router.post('/', async (req: Request, res: Response) => {
    try {
        const { name, person_id } = req.body;
        const { rows } = await pool.query('INSERT INTO todos(name, person_id) VALUES($1, $2) RETURNING *', [name, person_id]);
        res.status(201).json(rows[0]);
    } catch (err: any) {
        if (err.code === '23503') {
            res.status(400).json({ message: 'Invalid person ID' });
        }
        res.status(500).json({ message: 'Server error', error: err });
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const { rows } = await pool.query('SELECT * FROM todos WHERE id = $1', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.status(200).json(rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
})

router.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const { rows } = await pool.query('DELETE FROM todos WHERE id = $1 RETURNING *', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.status(204).json( { message: 'Delete success' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
})

router.put('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const { rows } = await pool.query('UPDATE todos SET id = $1, name = $2 WHERE id = $3 RETURNING *', [req.body.id, req.body.name, id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.status(200).json({ message: "Todo is updated" });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
})



export default router;