/**
 * Type definitions for the Restful-Booker API payloads.
 * See https://restful-booker.herokuapp.com/apidoc/index.html
 */
export interface BookingDates {
  checkin: string; // yyyy-mm-dd
  checkout: string; // yyyy-mm-dd
}

export interface Booking {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: BookingDates;
  additionalneeds?: string;
}

export interface CreatedBooking {
  bookingid: number;
  booking: Booking;
}

/**
 * Produces a valid booking payload with sensible defaults. Pass overrides to
 * exercise specific fields without repeating the full object in every test.
 */
export function buildBooking(overrides: Partial<Booking> = {}): Booking {
  return {
    firstname: 'Ada',
    lastname: 'Lovelace',
    totalprice: 250,
    depositpaid: true,
    bookingdates: {
      checkin: '2026-08-01',
      checkout: '2026-08-07',
    },
    additionalneeds: 'Breakfast',
    ...overrides,
  };
}
