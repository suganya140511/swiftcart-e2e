import { test, expect } from '../../src/fixtures/test-fixtures.js';
import { buildBooking, type Booking } from '../../src/data/booking-data.js';

test.describe('Restful-Booker: booking CRUD @regression', () => {
  test.beforeEach(async ({ bookingApi }) => {
    // Writes require a token; obtain one before each lifecycle test.
    await bookingApi.authenticate();
  });

  test('creates a booking and returns it verbatim', async ({ bookingApi }) => {
    const payload = buildBooking({ firstname: 'Grace', lastname: 'Hopper' });
    const { bookingid, booking } =
      await bookingApi.createBookingAndGetId(payload);

    expect(bookingid).toBeGreaterThan(0);
    expect(booking).toEqual(payload);
  });

  test('reads a created booking back by id', async ({ bookingApi }) => {
    const payload = buildBooking({ additionalneeds: 'Late checkout' });
    const { bookingid } = await bookingApi.createBookingAndGetId(payload);

    const res = await bookingApi.getBooking(bookingid);
    expect(res.status()).toBe(200);
    expect(await res.json()).toEqual(payload);
  });

  test('fully updates a booking with PUT', async ({ bookingApi }) => {
    const { bookingid } =
      await bookingApi.createBookingAndGetId(buildBooking());

    const updated: Booking = buildBooking({
      firstname: 'Katherine',
      lastname: 'Johnson',
      totalprice: 999,
      depositpaid: false,
    });
    const res = await bookingApi.updateBooking(bookingid, updated);
    expect(res.status()).toBe(200);
    expect(await res.json()).toEqual(updated);
  });

  test('partially updates a booking with PATCH', async ({ bookingApi }) => {
    const { bookingid } = await bookingApi.createBookingAndGetId(
      buildBooking({ firstname: 'Original' }),
    );

    const res = await bookingApi.patchBooking(bookingid, {
      firstname: 'Patched',
    });
    expect(res.status()).toBe(200);
    const body = (await res.json()) as Booking;
    expect(body.firstname).toBe('Patched');
    // Untouched fields survive the patch.
    expect(body.lastname).toBe('Lovelace');
  });

  test('deletes a booking and confirms it is gone', async ({ bookingApi }) => {
    const { bookingid } =
      await bookingApi.createBookingAndGetId(buildBooking());

    const del = await bookingApi.deleteBooking(bookingid);
    expect(del.status()).toBe(201);

    const getAfter = await bookingApi.getBooking(bookingid);
    expect(getAfter.status()).toBe(404);
  });
});
