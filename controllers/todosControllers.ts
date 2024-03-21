import {NextFunction, Request, Response} from 'express';
import pool from '../db/db';
import { ApiError } from "../utils/ApiError";

export async function getAllTodos(req: Request, res: Response, next: NextFunction):Promise<any> {
    try {
        const { rows } = await pool.query('SELECT * FROM todos');
        res.json(rows);
    } catch (err) {
        next(new ApiError(500, 'Failed to get todos'));
    }
}

export async function postTodo(req: Request, res: Response, next: NextFunction) {
    const { name, person_id } = req.body;
    try {
        const { rows } = await pool.query('INSERT INTO todos(name, person_id) VALUES($1, $2) RETURNING *', [name, person_id]);
        res.status(201).json(rows[0]);
    } catch (err: any) {
        if (err.code === '23503') {
             next(new ApiError(400, 'Invalid person ID'));
        }
        next(new ApiError(500, 'Failed to create todo'));
    }
}

export async function getTodoById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
        const { rows } = await pool.query('SELECT * FROM todos WHERE id = $1', [id]);
        if (rows.length === 0) {
            throw new ApiError(404, 'Todo not found');
        }
        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
}

export async function deleteTodo(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
        const { rows } = await pool.query('DELETE FROM todos WHERE id = $1 RETURNING *', [id]);
        if (rows.length === 0) {
            throw new ApiError(404, 'Todo not found');
        }
        res.status(204).send({ message: 'Todo deleted successfully' });
    } catch (err) {
        next(err);
    }
}

export async function updateTodo(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const { rows } = await pool.query('UPDATE todos SET name = $1 WHERE id = $2 RETURNING *', [name, id]);
        if (rows.length === 0) {
            throw new ApiError(404, 'Todo not found');
        }
        res.status(200).json({ message: "Todo updated successfully", todo: rows[0] });
    } catch (err) {
        next(err);
    }
}
