// routes/auth.js
const express = require('express');
const router = express.Router();
const { query } = require('../lib/database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// Animal Sightings Routes

// Get all animal sightings (protected - staff only)
router.get('/animal-sightings', authenticateToken, authorizeRoles(['admin', 'kruger_staff']), async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        id,
        species,
        location,
        gate,
        latitude,
        longitude,
        count,
        confidence,
        status,
        image_url as image,
        TO_CHAR(reported_at, 'YYYY-MM-DD HH24:MI:SS') as time,
        TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at
      FROM animal_sightings 
      ORDER BY reported_at DESC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching animal sightings:', error);
    res.status(500).json({ error: 'Failed to fetch animal sightings' });
  }
});

// Get recent animal sightings (public)
router.get('/animal-sightings/recent', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const result = await query(`
      SELECT 
        id,
        species,
        location,
        gate,
        count,
        confidence,
        status,
        image_url as image,
        TO_CHAR(reported_at, 'YYYY-MM-DD HH24:MI:SS') as time
      FROM animal_sightings 
      WHERE reported_at > NOW() - INTERVAL '24 hours'
      AND status IN ('recent', 'active')
      ORDER BY reported_at DESC 
      LIMIT $1
    `, [limit]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching recent animal sightings:', error);
    res.status(500).json({ error: 'Failed to fetch recent animal sightings' });
  }
});

// Create new animal sighting (protected - staff only)
router.post('/animal-sightings', authenticateToken, authorizeRoles(['admin', 'kruger_staff']), async (req, res) => {
  try {
    const { species, location, gate, count, confidence, status, image } = req.body;
    
    // Validate required fields
    if (!species || !location || !gate) {
      return res.status(400).json({ error: 'Species, location, and gate are required fields' });
    }

    const id = uuidv4();
    const result = await query(`
      INSERT INTO animal_sightings 
      (id, species, location, gate, count, confidence, status, image_url, reported_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      RETURNING 
        id,
        species,
        location,
        gate,
        count,
        confidence,
        status,
        image_url as image,
        TO_CHAR(reported_at, 'YYYY-MM-DD HH24:MI:SS') as time
    `, [id, species, location, gate, count || 1, confidence || 90, status || 'active', image || null]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating animal sighting:', error);
    res.status(500).json({ error: 'Failed to create animal sighting' });
  }
});

// Update animal sighting (protected - staff only)
router.put('/animal-sightings/:id', authenticateToken, authorizeRoles(['admin', 'kruger_staff']), async (req, res) => {
  try {
    const { id } = req.params;
    const { species, location, gate, count, confidence, status } = req.body;
    
    // Validate UUID format
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
      return res.status(400).json({ error: 'Invalid animal sighting ID format' });
    }

    const result = await query(`
      UPDATE animal_sightings 
      SET 
        species = $1,
        location = $2,
        gate = $3,
        count = $4,
        confidence = $5,
        status = $6,
        reported_at = CASE 
          WHEN $6 != status THEN NOW() 
          ELSE reported_at 
        END
      WHERE id = $7
      RETURNING 
        id,
        species,
        location,
        gate,
        count,
        confidence,
        status,
        image_url as image,
        TO_CHAR(reported_at, 'YYYY-MM-DD HH24:MI:SS') as time
    `, [species, location, gate, count, confidence, status, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Animal sighting not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating animal sighting:', error);
    res.status(500).json({ error: 'Failed to update animal sighting' });
  }
});

// Delete animal sighting (protected - staff only)
router.delete('/animal-sightings/:id', authenticateToken, authorizeRoles(['admin', 'kruger_staff']), async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate UUID format
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
      return res.status(400).json({ error: 'Invalid animal sighting ID format' });
    }

    const result = await query(`
      DELETE FROM animal_sightings 
      WHERE id = $1
      RETURNING id
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Animal sighting not found' });
    }
    
    res.json({ message: 'Animal sighting deleted successfully' });
  } catch (error) {
    console.error('Error deleting animal sighting:', error);
    res.status(500).json({ error: 'Failed to delete animal sighting' });
  }
});

// Get animal sighting statistics (protected - staff only)
router.get('/animal-sightings/stats', authenticateToken, authorizeRoles(['admin', 'kruger_staff']), async (req, res) => {
  try {
    const stats = await query(`
      SELECT 
        COUNT(*) as total_sightings,
        COUNT(CASE WHEN status = 'recent' THEN 1 END) as recent_count,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_count,
        COUNT(CASE WHEN species IN ('African Lion', 'African Elephant', 'Leopard', 'Cape Buffalo', 'White Rhinoceros', 'Black Rhinoceros') THEN 1 END) as big_five_count
      FROM animal_sightings
    `);
    
    res.json(stats.rows[0]);
  } catch (error) {
    console.error('Error fetching animal sighting stats:', error);
    res.status(500).json({ error: 'Failed to fetch animal sighting statistics' });
  }
});

// Get single animal sighting by ID
router.get('/animal-sightings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate UUID format
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
      return res.status(400).json({ error: 'Invalid animal sighting ID format' });
    }

    const result = await query(`
      SELECT 
        id,
        species,
        location,
        gate,
        latitude,
        longitude,
        count,
        confidence,
        status,
        image_url as image,
        TO_CHAR(reported_at, 'YYYY-MM-DD HH24:MI:SS') as time
      FROM animal_sightings 
      WHERE id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Animal sighting not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching animal sighting:', error);
    res.status(500).json({ error: 'Failed to fetch animal sighting' });
  }
});

module.exports = router;