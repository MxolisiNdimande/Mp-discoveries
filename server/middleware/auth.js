// middleware/auth.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { query } = require('../lib/database');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

const authorizeRoles = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

// Login route
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    console.log('Login attempt for:', email);

    // Find user in database
    const result = await query(
      'SELECT id, email, name, password_hash, role, status FROM users WHERE email = $1 AND status = $2',
      [email, 'active']
    );

    if (result.rows.length === 0) {
      console.log('User not found:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    console.log('Found user:', { email: user.email, role: user.role });

    let validPassword = false;

    // For development - accept plain text passwords for demo accounts
    if (email === 'admin@gatewaydiscoveries.com' && password === 'admin123') {
      validPassword = true;
      console.log('Admin demo password accepted');
      
      // Update to proper hash if still using placeholder
      if (user.password_hash.includes('ExampleHash')) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash('admin123', saltRounds);
        await query(
          'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
          [hashedPassword, user.id]
        );
        console.log('Updated admin password hash');
      }
    } 
    else if (email === 'ranger@kruger.co.za' && password === 'kruger123') {
      validPassword = true;
      console.log('Ranger demo password accepted');
      
      // Update to proper hash if still using placeholder
      if (user.password_hash.includes('ExampleHash')) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash('kruger123', saltRounds);
        await query(
          'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
          [hashedPassword, user.id]
        );
        console.log('Updated ranger password hash');
      }
    } 
    else {
      // Try bcrypt comparison for properly hashed passwords
      try {
        validPassword = await bcrypt.compare(password, user.password_hash);
        console.log('Bcrypt comparison result:', validPassword);
      } catch (bcryptError) {
        console.log('Bcrypt comparison failed:', bcryptError.message);
        // Fallback to direct comparison
        validPassword = password === user.password_hash;
      }
    }

    if (!validPassword) {
      console.log('Invalid password for:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('Password valid for:', email);

    // Update last login
    await query(
      'UPDATE users SET last_login = NOW() WHERE id = $1',
      [user.id]
    );

    // Create token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        name: user.name 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Login successful for:', email);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const result = await query(
      'SELECT id, email, name, role, last_login, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

// Verify token endpoint
const verifyToken = (req, res) => {
  res.json({
    valid: true,
    user: req.user
  });
};

module.exports = {
  authenticateToken,
  authorizeRoles,
  login,
  getProfile,
  verifyToken,
  JWT_SECRET
};