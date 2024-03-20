import pool from '../db';
import { QueryResult } from "pg";

type Todo = {
    id: number;
    name: string;
    person_id: string;
}

export const getAllTodos = async () => {
    const { rows } = await pool.query('SELECT * FROM todos');
    return rows;
}

export const postTodo = async (name: number | string, person_id: number | string):Promise<Todo> => {
    const { rows } = await pool.query(
        'INSERT INTO todos(name, person_id) VALUES($1, $2) RETURNING *',
        [name, person_id]
    );
    return rows[0];
}