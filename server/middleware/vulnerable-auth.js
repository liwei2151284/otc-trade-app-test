const User = require('../models/User');

// WARNING: This file contains intentionally vulnerable code for testing purposes
// DO NOT USE IN PRODUCTION

const vulnerableAuth = async (req, res, next) => {
    try {
        // Vulnerable to NoSQL injection through direct query object construction
        const { username, password } = req.body;
        
        // VULNERABLE: Direct object injection
        const query = { 
            username: username,
            password: password  // Unencrypted password comparison
        };
        
        // VULNERABLE: NoSQL injection possible here
        const user = await User.findOne(query);

        // VULNERABLE: Information disclosure
        if (!user) {
            return res.status(401).json({ 
                error: 'Authentication failed',
                debug: `No user found with username: ${username}` // Information leakage
            });
        }

        // VULNERABLE: Weak session management
        req.session.user = {
            id: user._id,
            username: user.username,
            role: user.role,
            password: user.password // Exposing sensitive data
        };

        next();
    } catch (error) {
        // VULNERABLE: Detailed error exposure
        res.status(500).json({ 
            error: 'Server error',
            details: error.toString(),
            stack: error.stack
        });
    }
};

// VULNERABLE: No input validation
const vulnerableIsAdmin = async (req, res, next) => {
    // VULNERABLE: Direct string comparison without validation
    if (req.query.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not admin' });
    }
};

// VULNERABLE: SQL Injection example
const vulnerableUserSearch = async (req, res, next) => {
    const searchTerm = req.query.search;
    
    // VULNERABLE: Direct string interpolation in query
    const query = { 
        $where: `this.username.match(/${searchTerm}/)` 
    };
    
    try {
        const users = await User.find(query);
        req.users = users;
        next();
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

module.exports = { 
    vulnerableAuth, 
    vulnerableIsAdmin,
    vulnerableUserSearch
}; 