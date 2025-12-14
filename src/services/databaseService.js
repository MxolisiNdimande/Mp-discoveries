// src/services/databaseService.js
import { query, cacheGet, cacheSet, cacheDelete } from '../lib/database.js';

export class DatabaseService {
  // Destinations
  static async getDestinations() {
    const cacheKey = 'destinations:all';
    const cached = await cacheGet(cacheKey);
    
    if (cached) {
      return cached;
    }

    const result = await query(`
      SELECT * FROM destinations 
      ORDER BY created_at DESC
    `);
    
    await cacheSet(cacheKey, result.rows, 1800); // Cache for 30 minutes
    return result.rows;
  }

  static async getDestinationById(id) {
    const cacheKey = `destination:${id}`;
    const cached = await cacheGet(cacheKey);
    
    if (cached) {
      return cached;
    }

    const result = await query(
      'SELECT * FROM destinations WHERE id = $1',
      [id]
    );
    
    if (result.rows.length > 0) {
      await cacheSet(cacheKey, result.rows[0], 900); // Cache for 15 minutes
      return result.rows[0];
    }
    
    return null;
  }

  // Animal Sightings
  static async getRecentAnimalSightings(limit = 10) {
    const cacheKey = `animal_sightings:recent:${limit}`;
    const cached = await cacheGet(cacheKey);
    
    if (cached) {
      return cached;
    }

    const result = await query(`
      SELECT * FROM animal_sightings 
      WHERE reported_at > NOW() - INTERVAL '24 hours'
      ORDER BY reported_at DESC 
      LIMIT $1
    `, [limit]);
    
    await cacheSet(cacheKey, result.rows, 300); // Cache for 5 minutes
    return result.rows;
  }

  static async createAnimalSighting(sightingData) {
    const { species, location, gate, latitude, longitude, count, confidence, status, image_url } = sightingData;
    
    const result = await query(`
      INSERT INTO animal_sightings 
      (species, location, gate, latitude, longitude, count, confidence, status, image_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [species, location, gate, latitude, longitude, count, confidence, status, image_url]);
    
    // Invalidate cache
    await cacheDelete('animal_sightings:recent:10');
    await cacheDelete('animal_sightings:recent:20');
    
    return result.rows[0];
  }

  // Accommodations
  static async getAccommodationsByDestination(destinationId) {
    const cacheKey = `accommodations:destination:${destinationId}`;
    const cached = await cacheGet(cacheKey);
    
    if (cached) {
      return cached;
    }

    const result = await query(`
      SELECT a.* FROM accommodations a
      JOIN destination_accommodations da ON a.id = da.accommodation_id
      WHERE da.destination_id = $1
      ORDER BY a.rating DESC
    `, [destinationId]);
    
    await cacheSet(cacheKey, result.rows, 3600); // Cache for 1 hour
    return result.rows;
  }

  // Analytics
  static async recordInteraction(interactionData) {
    const { device_id, session_id, interaction_type, destination_id, accommodation_id, flight_id, user_data } = interactionData;
    
    const result = await query(`
      INSERT INTO analytics 
      (device_id, session_id, interaction_type, destination_id, accommodation_id, flight_id, user_data)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [device_id, session_id, interaction_type, destination_id, accommodation_id, flight_id, user_data]);
    
    // Update destination counters
    if (destination_id && interaction_type === 'view') {
      await query(`
        UPDATE destinations SET views = views + 1 WHERE id = $1
      `, [destination_id]);
    }
    
    return result.rows[0];
  }

  // Flights
  static async searchFlights(origin, destination, date) {
    const cacheKey = `flights:search:${origin}:${destination}:${date}`;
    const cached = await cacheGet(cacheKey);
    
    if (cached) {
      return cached;
    }

    const result = await query(`
      SELECT * FROM flights 
      WHERE origin_code = $1 AND destination_code = $2
      ORDER BY departure_time ASC
    `, [origin, destination]);
    
    await cacheSet(cacheKey, result.rows, 600); // Cache for 10 minutes
    return result.rows;
  }
}