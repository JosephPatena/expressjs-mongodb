const { body, validationResult } = require('express-validator');

const taskRequest = () => {
    return [
        body('name')
            .notEmpty().withMessage('Name is required')
            .isLength({ max: 255 }).withMessage('Name must be at most 255 characters long'),
        body('description')
            .optional()
            .isString().withMessage('Description must be a string'),
        body('due_date')
            .optional(),
        body('project_id')
            .notEmpty().withMessage('Project ID is required'),
        body('assigned_user_id')
            .optional(),
        body('tester_user_id')
            .optional(),
        body('reviewer_user_id')
            .optional(),
        body('status')
            .notEmpty().withMessage('Status is required')
            .isIn(['pending', 'in_progress', 'testing', 'completed']).withMessage('Invalid status'),
        body('priority')
            .notEmpty().withMessage('Priority is required')
            .isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
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
    taskRequest,
    validate,
};