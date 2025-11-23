// Check if user has one of the allowed roles
const permit = (...allowedRoles) => {
    return (req, res, next) => {
        if (req.user && allowedRoles.includes(req.user.role)) {
            next();
        } else {
            res.status(403).json({ msg: 'Forbidden: Insufficient permissions' });
        }
    };
};

module.exports = { permit };