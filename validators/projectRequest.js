const { body, validationResult } = require('express-validator');

const projectRequest = () => {
    return [
        body('name')
            .notEmpty().withMessage('Name is required')
            .isLength({ max: 255 }).withMessage('Name must be at most 255 characters long'),
        body('description')
            .optional()
            .isString().withMessage('Description must be a string'),
        body('due_date')
            .optional()
            .isISO8601().withMessage('Due date must be a valid date'),
        body('status')
            .notEmpty().withMessage('Status is required')
            .isIn(['pending', 'in_progress', 'testing', 'completed']).withMessage('Invalid status'),
    ];
};

const validate = (req, res, next) => {
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
    projectRequest,
    validate,
};