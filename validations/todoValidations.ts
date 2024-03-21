import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateTodo = [
    body('name').trim().isLength({ min: 1 }).withMessage('Name must not be empty'),
    body('person_id').isInt({ gt: 0 }).withMessage('Person ID must be a positive integer'),
]

export const checkValidationResult = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};