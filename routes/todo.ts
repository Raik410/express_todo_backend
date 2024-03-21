import express from 'express';
import * as todoController from '../controllers/todosControllers';
import {checkValidationResult, validateTodo} from "../validations/todoValidations";

const router = express.Router();

router.get('/', todoController.getAllTodos);
router.post('/',
    validateTodo,
    checkValidationResult,
    todoController.postTodo);
router.get('/:id', todoController.getTodoById);
router.delete('/:id', todoController.deleteTodo);
router.put('/:id',
    validateTodo,
    checkValidationResult,
    todoController.updateTodo);

export default router;
