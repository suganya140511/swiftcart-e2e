import { test, expect } from '../../src/fixtures/test-fixtures.js';
import { buildBooking } from '../../src/data/booking-data.js';

test.describe('Restful-Booker: contracts & authorization @regression', () => {
  test('GET /booking returns a list of id objects', async ({ bookingApi }) => {
    // Seed one booking so the list is guaranteed non-empty and the contract
    // assertions below are deterministic rather than conditional.
    await bookingApi.authenticate();
    await bookingApi.createBookingAndGetId(buildBooking());

    const res = await bookingApi.getBookingIds();
    expect(res.status()).toBe(200);

    const body = (await res.json()) as Array<{ bookingid: number }>;
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    expect(body[0]).toHaveProperty('bookingid');
    expect(typeof body[0].bookingid).toBe('number');
  });

  test('GET /booking?firstname&lastname filters results', async ({
    bookingApi,
  }) => {
    const unique = `Filter${Date.now()}`;
    await bookingApi.authenticate();
    const { bookingid } = await bookingApi.createBookingAndGetId(
      buildBooking({ firstname: unique, lastname: 'Test' }),
    );

    const res = await bookingApi.getBookingIds({
      firstname: unique,
      lastname: 'Test',
    });
    expect(res.status()).toBe(200);
    const ids = (await res.json()) as Array<{ bookingid: number }>;
    expect(ids.map((i) => i.bookingid)).toContain(bookingid);
  });

  test('DELETE without a token is rejected', async ({ request }) => {
    // Deliberately skip authentication and hit the endpoint directly.
    const res = await request.delete('/booking/1');
    expect(res.status()).toBe(403);
  });

  test('GET a non-existent booking returns 404', async ({ bookingApi }) => {
    const res = await bookingApi.getBooking(9_999_999);
    expect(res.status()).toBe(404);
  });
});
