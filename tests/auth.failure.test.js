import request from 'supertest';
import { describe, it, expect } from 'vitest';
import app from '../server/index.js';

describe('Auth failure cases', () => {
  it('should return 401 for invalid credentials', async () => {
    const credentials = { email: 'nonexistent@example.com', password: 'badpassword' };

    const res = await request(app)
      .post('/api/auth/login')
      .send(credentials)
      .set('Accept', 'application/json');

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });
});
