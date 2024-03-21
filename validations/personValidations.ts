import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validatePersonRegister = [
    body('name').trim().isLength({ min: 1 }).withMessage('Name must not be empty'),
    body('lastname').trim().isLength({ min: 1 }).withMessage('Lastname must not be empty'),
    body('nickname').trim().isLength({ min: 1 }).withMessage('Nickname must not be empty'),
    body('password').trim().isLength({ min: 1 }).withMessage('Password must not be empty'),
]

export const validatePersonLogin = [
    body('nickname').trim().isLength({ min: 1 }).withMessage('Nickname must not be empty'),
    body('password').trim().isLength({ min: 1 }).withMessage('Password must not be empty'),
]

export const checkValidationResult = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};