const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Add user payload to request object
        next();
    } catch (ex) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

// Middleware to check if the user has a specific role
const requireRole = (requiredRole) => {
    return (req, res, next) => {
        if (!req.user || req.user.role !== requiredRole) {
            return res.status(403).json({ message: `Forbidden: ${requiredRole} access required.` });
        }
        next();
    };
};

// Middleware to check if a company is verified (placeholder for now)
const isCompanyVerified = async (req, res, next) => {
    // In a real application, you would fetch the company's verification status from the DB
    // For now, we'll assume a company is verified if they are logged in as a company.
    if (req.user.role === 'company') {
        // You might add a DB check here: const company = await pool.request().input('companyId', req.user.id).query('SELECT IsVerified FROM Companies WHERE CompanyID = @companyId');
        // if (!company.recordset[0].IsVerified) return res.status(403).json({ message: 'Company not verified.' });
        next();
    } else {
        return res.status(403).json({ message: 'Forbidden: Only verified companies can perform this action.' });
    }
};

module.exports = { authenticate, requireRole, isCompanyVerified };