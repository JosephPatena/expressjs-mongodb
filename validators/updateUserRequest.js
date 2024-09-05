const { body, validationResult } = require('express-validator');
const User = require("../models/userModel");

const updateUserRequest = (userId) => {
    return [
        // Name validation
        body('name')
            .notEmpty().withMessage('Name is required')
            .isString().withMessage('Name must be a string')
            .isLength({ max: 255 }).withMessage('Name must be at most 255 characters long'),
        
        // Email validation
        body('email')
            .notEmpty().withMessage('Email is required')
            .isString().withMessage('Email must be a string')
            .isEmail().withMessage('Email must be valid')
            .custom(async (value) => {
                const user = await User.findOne({ email: value });
                if (user && user._id.toString() !== userId) {
                    throw new Error('Email already in use');
                }
                return true;
            }),
        
        // Password validation
        body('password')
            .notEmpty().withMessage('Password is required')
            .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
            .matches(/[a-zA-Z]/).withMessage('Password must contain at least one letter')
            .matches(/[^a-zA-Z0-9]/).withMessage('Password must contain at least one symbol'),
        
        // Password confirmation validation
        body('password_confirmation')
            .notEmpty().withMessage('Password confirmation is required')
            .custom((value, { req }) => {
                if (value != req.body.password) {
                    throw new Error('Password confirmation does not match password');
                }
                return true;
            }),
    ];
};

const validateUpdateUserRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().reduce((acc, err) => {
            acc[err.path] = acc[err.path] || [];
            acc[err.path].push(err.msg);
            return acc;
        }, {});

        return res.status(422).json({ errors: formattedErrors });
    }
    next();
};

module.exports = {
    updateUserRequest,
    validateUpdateUserRequest,
};