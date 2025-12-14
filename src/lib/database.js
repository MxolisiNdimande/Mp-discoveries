// src/lib/database.js
import pkg from 'pg';
const { Pool } = pkg;
import Redis from 'ioredis';
import { config } from 'dotenv';

config();

// PostgreSQL connection
export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Redis connection
export const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
});

// Test connections
export const testConnections = async () => {
  try {
    const dbClient = await pool.connect();
    console.log('✅ PostgreSQL connected successfully');
    dbClient.release();

    await redis.ping();
    console.log('✅ Redis connected successfully');

    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
};

// Utility functions
export const query = (text, params) => pool.query(text, params);

// Redis utility functions
export const cacheGet = async (key) => {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
};

export const cacheSet = async (key, data, expireSeconds = 3600) => {
  await redis.setex(key, expireSeconds, JSON.stringify(data));
};

export const cacheDelete = async (key) => {
  await redis.del(key);
};

// Real-time animal sightings
export const publishSighting = async (sighting) => {
  await redis.publish('animal_sightings', JSON.stringify(sighting));
};

export const subscribeToSightings = (callback) => {
  const subscriber = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  });

  subscriber.subscribe('animal_sightings');
  subscriber.on('message', (channel, message) => {
    if (channel === 'animal_sightings') {
      callback(JSON.parse(message));
    }
  });

  return subscriber;
};