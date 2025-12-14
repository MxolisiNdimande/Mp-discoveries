import request from 'supertest';
import { describe, it, expect } from 'vitest';
import app from '../server/index.js';

describe('Auth API', () => {
  it('should login and return token and user, and allow profile fetch', async () => {
    const credentials = { email: 'admin@gatewaydiscoveries.com', password: 'admin123' };

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send(credentials)
      .set('Accept', 'application/json');

    expect(loginRes.status).toBe(200);
    expect(loginRes.body).toHaveProperty('token');
    expect(loginRes.body).toHaveProperty('user');
    expect(loginRes.body.user.email).toBe(credentials.email);

    const token = loginRes.body.token;

    const profileRes = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    expect(profileRes.status).toBe(200);
    expect(profileRes.body).toHaveProperty('email', credentials.email);
  });
});
