// server/index.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import db from './db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// In-memory data storage (replace with database later)
let animalSightings = [
  {
    id: "a1",
    species: "African Lion",
    location: "Skukuza Rest Camp Area",
    gate: "Paul Kruger Gate",
    time: "45 minutes ago",
    image: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=400",
    status: "recent",
    count: 3,
    confidence: 95
  },
  {
    id: "a2", 
    species: "African Elephant",
    location: "Lower Sabie River",
    gate: "Crocodile Bridge", 
    time: "2 hours ago",
    image: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=400",
    status: "active",
    count: 12,
    confidence: 98
  }
];

let destinations = [
  {
    id: "kruger",
    name: "Kruger National Park",
    country: "South Africa",
    description: "One of Africa's largest game reserves with high density of wild animals including the Big 5.",
    imageUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800",
    rating: 4.8,
    category: "Wildlife & Nature",
    avgCost: "R2,500 - R8,000",
    bestTime: "May - September",
    activities: ["Game Drives", "Bird Watching", "Bush Walks", "Photography", "Camping"],
    hasAnimalTracking: true,
    views: 15420,
    scans: 3245,
    emailsSent: 876
  },
  {
    id: "blyde",
    name: "Blyde River Canyon", 
    country: "South Africa",
    description: "A spectacular natural landmark with dramatic scenery, waterfalls, and panoramic views.",
    imageUrl: "https://images.unsplash.com/photo-1574784912348-5c1d915b0f6c?w=800",
    rating: 4.7,
    category: "Nature & Scenery",
    avgCost: "R1,200 - R4,000",
    bestTime: "March - October",
    activities: ["Hiking", "Boat Trips", "Photography", "Viewpoints", "Nature Walks"],
    hasAnimalTracking: false,
    views: 8920,
    scans: 1876,
    emailsSent: 543
  }
];

let accommodations = [
  {
    id: "acc1",
    name: "Singita Lebombo Lodge",
    type: "lodge",
    location: "Kruger National Park",
    description: "Luxury lodge perched on the cliffs overlooking the N'wanetsi River with stunning views and exclusive safari experiences.",
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
    rating: 4.9,
    pricePerNight: "R12,500",
    amenities: ["Swimming Pool", "Spa", "Fine Dining", "Game Drives", "WiFi", "Air Conditioning"],
    contact: {
      phone: "+27 13 735 5500",
      email: "reservations@singita.com",
      website: "singita.com"
    }
  },
  {
    id: "acc2",
    name: "Jock Safari Lodge",
    type: "lodge",
    location: "Kruger National Park",
    description: "Historic safari lodge offering authentic African experiences with professional guides and luxurious accommodations.",
    imageUrl: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800",
    rating: 4.7,
    pricePerNight: "R8,200",
    amenities: ["Swimming Pool", "Restaurant", "Bar", "Game Drives", "Bush Walks", "Spa"],
    contact: {
      phone: "+27 13 781 9900",
      email: "info@jocksafarilodge.com",
      website: "jocksafarilodge.com"
    }
  }
];

let flights = [
  {
    id: "f1",
    flightNumber: "SA345",
    airline: "South African Airways",
    origin: "Johannesburg (JNB)",
    originCode: "JNB",
    destination: "Nelspruit (MQP)",
    destinationCode: "MQP",
    departureTime: "08:15",
    arrivalTime: "09:30",
    duration: "1h 15m",
    status: "On Time",
    gate: "A12",
    price: "R1,850"
  },
  {
    id: "f2",
    flightNumber: "FA208",
    airline: "FlySafair",
    origin: "Cape Town (CPT)",
    originCode: "CPT",
    destination: "Nelspruit (MQP)",
    destinationCode: "MQP",
    departureTime: "11:45",
    arrivalTime: "14:00",
    duration: "2h 15m",
    status: "On Time",
    gate: "B07",
    price: "R2,150"
  }
];

let analyticsData = {
  totalInteractions: 45890,
  totalScans: 12450,
  totalEmails: 3450,
  avgEngagementTime: "4m 23s",
  deviceStatus: {
    online: 18,
    offline: 2,
    maintenance: 1
  },
  dailyInteractions: [
    { date: "Mon", value: 4230 },
    { date: "Tue", value: 5870 },
    { date: "Wed", value: 6540 },
    { date: "Thu", value: 5120 },
    { date: "Fri", value: 7890 },
    { date: "Sat", value: 9230 },
    { date: "Sun", value: 7120 }
  ],
  topDestinations: [
    { name: "Kruger National Park", percentage: 42 },
    { name: "Blyde River Canyon", percentage: 23 },
    { name: "God's Window", percentage: 15 },
    { name: "Sabie Sand Reserve", percentage: 12 },
    { name: "Other", percentage: 8 }
  ]
};

// Users data
let users = [
  {
    id: "user1",
    email: "admin@gatewaydiscoveries.com",
    password: "admin123", // Plain text for demo - in production use bcrypt
    name: "System Administrator",
    role: "admin",
    status: "active",
    lastLogin: null
  },
  {
    id: "user2",
    email: "ranger@kruger.co.za",
    password: "kruger123", // Plain text for demo - in production use bcrypt
    name: "Kruger Park Ranger",
    role: "kruger_staff",
    status: "active",
    lastLogin: null
  }
];

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Authentication middleware
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

// ==================== HEALTH CHECK ====================
app.get('/api/health', (req, res) => {
  (async () => {
    const dbConnected = await db.testConnection();
    res.json({
      status: 'OK',
      message: 'Gateway Discoveries Backend is running!',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      database: dbConnected ? 'connected' : 'not-configured'
    });
  })();
});

// ==================== AUTHENTICATION API ====================
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt for:', email);
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = users.find(u => u.email === email && u.status === 'active');
    
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('Found user:', { email: user.email, role: user.role });

    // Check password (plain text for demo)
    let validPassword = false;
    
    if (email === 'admin@gatewaydiscoveries.com' && password === 'admin123') {
      validPassword = true;
      console.log('Admin demo password accepted');
    } else if (email === 'ranger@kruger.co.za' && password === 'kruger123') {
      validPassword = true;
      console.log('Ranger demo password accepted');
    } else {
      // For other users, you could implement bcrypt
      validPassword = password === user.password;
    }

    if (!validPassword) {
      console.log('Invalid password for:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('Password valid for:', email);

    // Update last login
    user.lastLogin = new Date().toISOString();

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
});

// Get user profile
app.get('/api/auth/profile', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    lastLogin: user.lastLogin
  });
});

// Verify token
app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({
    valid: true,
    user: req.user
  });
});

// ==================== DESTINATIONS API ====================
app.get('/api/destinations', (req, res) => {
  (async () => {
    try {
      if (db && db.pool) {
        const { rows } = await db.query('SELECT id, name, country, description, image_url as "imageUrl", rating, category, avg_cost as "avgCost", best_time as "bestTime", has_animal_tracking as "hasAnimalTracking", views, scans, emails_sent as "emailsSent" FROM destinations ORDER BY views DESC');
        return res.json(rows);
      }
    } catch (err) {
      console.error('Error fetching destinations from DB:', err.message || err);
    }

    res.json(destinations);
  })();
});

app.get('/api/destinations/:id', (req, res) => {
  const { id } = req.params;
  (async () => {
    try {
      if (db && db.pool) {
        const { rows } = await db.query('SELECT id, name, country, description, image_url as "imageUrl", rating, category, avg_cost as "avgCost", best_time as "bestTime", has_animal_tracking as "hasAnimalTracking", views, scans, emails_sent as "emailsSent" FROM destinations WHERE id = $1', [id]);
        if (rows.length) return res.json(rows[0]);
        return res.status(404).json({ error: 'Destination not found' });
      }
    } catch (err) {
      console.error('Error fetching destination from DB:', err.message || err);
    }

    const destination = destinations.find(d => d.id === id);
    if (!destination) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    res.json(destination);
  })();
});

// ==================== ANIMAL SIGHTINGS API ====================
// Public route - get recent sightings
app.get('/api/animal-sightings/recent', (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  (async () => {
    try {
      if (db && db.pool) {
        const { rows } = await db.query("SELECT id, species, location, gate, image_url as \"image\", status, count, confidence, reported_at as \"time\" FROM animal_sightings WHERE status IN ('recent','active') ORDER BY reported_at DESC LIMIT $1", [limit]);
        return res.json(rows);
      }
    } catch (err) {
      console.error('Error fetching animal sightings from DB:', err.message || err);
    }

    const recentSightings = animalSightings
      .filter(s => s.status === 'recent' || s.status === 'active')
      .slice(0, limit);

    res.json(recentSightings);
  })();
});

// Protected routes - require authentication
app.get('/api/animal-sightings', authenticateToken, authorizeRoles(['admin', 'kruger_staff']), (req, res) => {
  res.json(animalSightings);
});

app.get('/api/animal-sightings/:id', authenticateToken, authorizeRoles(['admin', 'kruger_staff']), (req, res) => {
  const { id } = req.params;
  const sighting = animalSightings.find(s => s.id === id);
  
  if (!sighting) {
    return res.status(404).json({ error: 'Animal sighting not found' });
  }
  
  res.json(sighting);
});

// POST - Create new animal sighting (protected)
app.post('/api/animal-sightings', authenticateToken, authorizeRoles(['admin', 'kruger_staff']), (req, res) => {
  const { species, location, gate, count, confidence, status, image } = req.body;
  
  if (!species || !location || !gate) {
    return res.status(400).json({ error: 'Species, location, and gate are required' });
  }

  const newSighting = {
    id: `a${Date.now()}`,
    species,
    location,
    gate,
    count: count || 1,
    confidence: confidence || 90,
    status: status || 'recent',
    image: image || 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=400',
    time: 'Just now',
    reported_at: new Date().toISOString()
  };
  
  animalSightings.unshift(newSighting); // Add to beginning of array
  
  console.log('New animal sighting created:', newSighting);
  res.status(201).json(newSighting);
});

// PUT - Update animal sighting (protected)
app.put('/api/animal-sightings/:id', authenticateToken, authorizeRoles(['admin', 'kruger_staff']), (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  const sightingIndex = animalSightings.findIndex(s => s.id === id);
  
  if (sightingIndex === -1) {
    return res.status(404).json({ error: 'Animal sighting not found' });
  }
  
  // Update the sighting
  animalSightings[sightingIndex] = {
    ...animalSightings[sightingIndex],
    ...updates,
    time: 'Updated just now'
  };
  
  console.log(`Animal sighting ${id} updated:`, animalSightings[sightingIndex]);
  res.json(animalSightings[sightingIndex]);
});

// DELETE - Remove animal sighting (protected)
app.delete('/api/animal-sightings/:id', authenticateToken, authorizeRoles(['admin', 'kruger_staff']), (req, res) => {
  const { id } = req.params;
  
  const sightingIndex = animalSightings.findIndex(s => s.id === id);
  
  if (sightingIndex === -1) {
    return res.status(404).json({ error: 'Animal sighting not found' });
  }
  
  const deletedSighting = animalSightings.splice(sightingIndex, 1)[0];
  
  console.log(`Animal sighting ${id} deleted:`, deletedSighting);
  res.json({ 
    message: `Sighting ${id} deleted successfully`,
    deletedSighting 
  });
});

// Get animal sighting statistics (protected)
app.get('/api/animal-sightings/stats', authenticateToken, authorizeRoles(['admin', 'kruger_staff']), (req, res) => {
  const stats = {
    total_sightings: animalSightings.length,
    recent_count: animalSightings.filter(s => s.status === 'recent').length,
    active_count: animalSightings.filter(s => s.status === 'active').length,
    big_five_count: animalSightings.filter(s => 
      ['African Lion', 'African Elephant', 'Leopard', 'Cape Buffalo', 'White Rhinoceros', 'Black Rhinoceros'].includes(s.species)
    ).length
  };
  
  res.json(stats);
});

// ==================== ACCOMMODATIONS API ====================
app.get('/api/accommodations', (req, res) => {
  res.json(accommodations);
});

app.get('/api/accommodations/:id', (req, res) => {
  const { id } = req.params;
  const accommodation = accommodations.find(a => a.id === id);
  
  if (!accommodation) {
    return res.status(404).json({ error: 'Accommodation not found' });
  }
  
  res.json(accommodation);
});

// POST - Create new accommodation
app.post('/api/accommodations', authenticateToken, authorizeRoles(['admin']), (req, res) => {
  const { name, type, location, description, imageUrl, rating, pricePerNight, amenities, contact } = req.body;
  
  if (!name || !type || !location) {
    return res.status(400).json({ error: 'Name, type, and location are required' });
  }

  const newAccommodation = {
    id: `acc${Date.now()}`,
    name,
    type,
    location,
    description: description || '',
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    rating: rating || 4.0,
    pricePerNight: pricePerNight || 'R1,000',
    amenities: amenities || [],
    contact: contact || {
      phone: '',
      email: '',
      website: ''
    },
    created_at: new Date().toISOString()
  };
  
  accommodations.unshift(newAccommodation);
  
  console.log('New accommodation created:', newAccommodation);
  res.status(201).json(newAccommodation);
});

// ==================== FLIGHTS API ====================
app.get('/api/flights', (req, res) => {
  const { origin, destination } = req.query;
  (async () => {
    try {
      if (db && db.pool) {
        const clauses = [];
        const params = [];
        let idx = 1;

        if (origin && origin !== 'all') {
          clauses.push(`origin_code = $${idx++}`);
          params.push(origin);
        }
        if (destination && destination !== 'all') {
          clauses.push(`destination_code = $${idx++}`);
          params.push(destination);
        }

        const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
        const q = `SELECT id, flight_number as "flightNumber", airline, origin_city as origin, origin_code as "originCode", destination_city as destination, destination_code as "destinationCode", to_char(departure_time, 'HH24:MI') as departure_time, to_char(arrival_time, 'HH24:MI') as arrival_time, duration, status, gate, price FROM flights ${where} ORDER BY departure_time`;
        const { rows } = await db.query(q, params);
        return res.json(rows);
      }
    } catch (err) {
      console.error('Error fetching flights from DB:', err.message || err);
    }

    let filteredFlights = flights;

    if (origin && origin !== 'all') {
      filteredFlights = filteredFlights.filter(f => f.originCode === origin);
    }
    if (destination && destination !== 'all') {
      filteredFlights = filteredFlights.filter(f => f.destinationCode === destination);
    }

    res.json(filteredFlights);
  })();
});

app.get('/api/flights/:id', (req, res) => {
  const { id } = req.params;
  const flight = flights.find(f => f.id === id);
  
  if (!flight) {
    return res.status(404).json({ error: 'Flight not found' });
  }
  
  res.json(flight);
});

// ==================== ANALYTICS API ====================
app.get('/api/analytics', authenticateToken, authorizeRoles(['admin']), (req, res) => {
  res.json(analyticsData);
});

app.get('/api/analytics/destinations', authenticateToken, authorizeRoles(['admin']), (req, res) => {
  const destinationAnalytics = destinations.map(dest => ({
    name: dest.name,
    interactions: dest.views,
    scans: dest.scans,
    emails: dest.emailsSent
  }));
  
  res.json(destinationAnalytics);
});

// POST - Record interaction
app.post('/api/analytics/interactions', (req, res) => {
  const { device_id, session_id, interaction_type, destination_id, accommodation_id, flight_id, user_data } = req.body;
  
  if (!interaction_type) {
    return res.status(400).json({ error: 'Interaction type is required' });
  }

  const newInteraction = {
    id: `ia${Date.now()}`,
    device_id,
    session_id,
    interaction_type,
    destination_id,
    accommodation_id,
    flight_id,
    user_data,
    created_at: new Date().toISOString()
  };
  
  // Update destination views if it's a view interaction
  if (interaction_type === 'view' && destination_id) {
    const destination = destinations.find(d => d.id === destination_id);
    if (destination) {
      destination.views = (destination.views || 0) + 1;
    }
  }
  
  // Update total interactions
  analyticsData.totalInteractions += 1;
  
  console.log('New interaction recorded:', newInteraction);
  res.status(201).json(newInteraction);
});

// ==================== CMS & ADMIN API ====================
app.get('/api/admin/dashboard', authenticateToken, authorizeRoles(['admin']), (req, res) => {
  const dashboardData = {
    totalDestinations: destinations.length,
    totalAccommodations: accommodations.length,
    totalFlights: flights.length,
    totalSightings: animalSightings.length,
    recentSightings: animalSightings.filter(s => s.status === 'recent').length,
    onlineDevices: analyticsData.deviceStatus.online,
    systemUptime: '99.8%'
  };
  
  res.json(dashboardData);
});

// ==================== ERROR HANDLING ====================

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    path: req.originalUrl
  });
});

// General error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  import('path').then(path => {
    app.use(express.static(path.default.resolve('dist')));
    
    // Handle SPA routing
    app.get('*', (req, res) => {
      res.sendFile(path.default.resolve('dist', 'index.html'));
    });
  }).catch(err => {
    console.error('Error importing path module:', err);
  });
}

// Export app for testing
export default app;

// Keep a reference to the server so we can close it gracefully on restart or errors
let server = null;

// Only start the server when not running under test environment
if (process.env.NODE_ENV !== 'test') {
  // Start server and keep the instance
  server = app.listen(PORT, async () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔐 Login endpoint: http://localhost:${PORT}/api/auth/login`);
    console.log(`🌍 Destinations API: http://localhost:${PORT}/api/destinations`);
    console.log(`🐘 Animal Sightings API: http://localhost:${PORT}/api/animal-sightings`);
    console.log(`🏨 Accommodations API: http://localhost:${PORT}/api/accommodations`);
    console.log(`✈️  Flights API: http://localhost:${PORT}/api/flights`);
    console.log(`📈 Analytics API: http://localhost:${PORT}/api/analytics`);

    const dbConnected = await db.testConnection();
    console.log(`🗄️  Database: ${dbConnected ? 'connected' : 'not configured / unavailable'}`);

    console.log('\n💡 Demo Credentials:');
    console.log('   Admin: admin@gatewaydiscoveries.com / admin123');
    console.log('   Ranger: ranger@kruger.co.za / kruger123');
    console.log('\n💡 Tip: Use Postman or curl to test the API endpoints!');
  });

  // Surface listen errors clearly (e.g., EADDRINUSE)
  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. If you expect the server to be restarted, ensure the previous process exited.`);
      console.error(`On Windows you can run: netstat -ano | findstr :${PORT}  (then taskkill /PID <pid> /F)`);
    } else {
      console.error('Server error:', err);
    }
  });

  // Graceful shutdown helper
  const gracefulShutdown = (signal) => {
    console.log(`Received ${signal}. Closing server...`);
    if (!server) {
      process.exit(0);
      return;
    }
    server.close(() => {
      console.log('Server closed. Exiting process.');
      // For nodemon's SIGUSR2 we re-emit the signal so it can restart properly
      if (signal === 'SIGUSR2') {
        process.kill(process.pid, 'SIGUSR2');
      } else {
        process.exit(0);
      }
    });

    // Force exit if graceful shutdown takes too long
    setTimeout(() => {
      console.warn('Forcing exit after timeout.');
      process.exit(1);
    }, 5000).unref();
  };

  // Handle termination signals so nodemon or other process managers can restart cleanly
  process.once('SIGUSR2', () => gracefulShutdown('SIGUSR2'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
}

// Global error handlers to surface crashes in logs for easier debugging
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Try to close the server gracefully before exiting so nodemon can restart cleanly
  if (server) {
    try {
      server.close(() => {
        console.log('Server closed due to uncaught exception. Exiting.');
        process.exit(1);
      });
      // Force exit if close hangs
      setTimeout(() => process.exit(1), 5000).unref();
    } catch (e) {
      process.exit(1);
    }
  } else {
    process.exit(1);
  }
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  if (server) {
    try {
      server.close(() => {
        console.log('Server closed due to unhandled rejection. Exiting.');
        process.exit(1);
      });
      setTimeout(() => process.exit(1), 5000).unref();
    } catch (e) {
      process.exit(1);
    }
  } else {
    process.exit(1);
  }
});