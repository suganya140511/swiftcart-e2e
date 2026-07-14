import { test, expect } from '../../src/fixtures/test-fixtures.js';

test.describe('Restful-Booker: auth & health @smoke', () => {
  test('GET /ping returns 201 when the service is up', async ({
    bookingApi,
  }) => {
    const res = await bookingApi.ping();
    expect(res.status()).toBe(201);
  });

  test('POST /auth returns a token for valid credentials', async ({
    bookingApi,
  }) => {
    const token = await bookingApi.authenticate();
    expect(token).toMatch(/^[a-z0-9]+$/i);
  });

  test('POST /auth returns "Bad credentials" for invalid login', async ({
    request,
  }) => {
    const res = await request.post('/auth', {
      data: { username: 'admin', password: 'not-the-password' },
    });
    expect(res.status()).toBe(200);
    const body = (await res.json()) as { reason?: string; token?: string };
    expect(body.token).toBeUndefined();
    expect(body.reason).toBe('Bad credentials');
  });
});
