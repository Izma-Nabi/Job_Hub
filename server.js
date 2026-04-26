const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // Import the cors package
const authRoutes = require('./routes/auth');
const jobsRoutes = require('./routes/jobs');
const candidateRoutes = require('./routes/candidate');
const companyRoutes = require('./routes/company');
const adminRoutes = require('./routes/admin'); // Import admin routes
const { authenticate } = require('./middleware/auth');
const jwt = require('jsonwebtoken');

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'change_this_secret') {
    if (process.env.NODE_ENV === 'production') {
        console.error('FATAL: JWT_SECRET is not set or is using the default. Set JWT_SECRET and restart.');
        process.exit(1);
    } else {
        console.warn('Warning: JWT_SECRET is not set or is using the default.');
    }
}

const app = express();
app.use(cors()); // Use cors middleware to allow cross-origin requests
app.use(express.json());

app.get('/', (req, res) => res.json({ ok: true, message: 'Job Portal Backend' }));

// Mount all API routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/candidate', candidateRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/admin', adminRoutes); // Mount admin routes
app.use('/api/applications', require('./application'));

// Debug routes…
app.get('/api/debug/headers', (req, res) => res.json({ headers: req.headers }));
app.get('/api/debug/user', authenticate, (req, res) => res.json({ user: req.user }));
app.get('/api/debug/decode', (req, res) => {
    const token = (req.query && req.query.token)
        || (req.headers.authorization && (req.headers.authorization + '').replace(/Bearer\s+/i, ''));

    if (!token) return res.status(400).json({ error: 'token required' });

    const decoded = jwt.decode(token, { complete: true });

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        return res.json({ decoded, verified });
    } catch (err) {
        return res.status(200).json({ decoded, verifyError: err.message });
    }
});

const PORT = process.env.PORT || 5000; // Changed backend port to 5000
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
