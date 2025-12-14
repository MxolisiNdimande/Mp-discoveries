import request from 'supertest';
import { describe, it, expect } from 'vitest';
import app from '../server/index.js';

describe('Protected endpoints', () => {
  it('should return 401 when accessing protected animal-sightings without token', async () => {
    const res = await request(app)
      .get('/api/animal-sightings')
      .set('Accept', 'application/json');

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  it('should allow admin to access protected animal-sightings', async () => {
    const credentials = { email: 'admin@gatewaydiscoveries.com', password: 'admin123' };
    const loginRes = await request(app).post('/api/auth/login').send(credentials);
    expect(loginRes.status).toBe(200);
    const token = loginRes.body.token;

    const res = await request(app)
      .get('/api/animal-sightings')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
