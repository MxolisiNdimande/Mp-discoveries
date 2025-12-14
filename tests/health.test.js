import request from 'supertest';
import { describe, it, expect } from 'vitest';
import app from '../server/index.js';

describe('Health endpoint', () => {
  it('GET /api/health should return OK status and message', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'OK');
    expect(res.body).toHaveProperty('message');
  });
});
