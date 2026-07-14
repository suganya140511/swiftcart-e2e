import {
  type APIRequestContext,
  type APIResponse,
  expect,
} from '@playwright/test';
import type { Booking, CreatedBooking } from '../data/booking-data.js';

/**
 * Thin, typed wrapper over the Restful-Booker REST API.
 *
 * Restful-Booker guards write operations (PUT/PATCH/DELETE) behind either a
 * cookie token obtained from POST /auth or Basic auth. This client fetches a
 * token lazily and sends it as a Cookie header, which is the documented path.
 */
export class BookingApiClient {
  private token: string | undefined;

  constructor(private readonly request: APIRequestContext) {}

  /** POST /auth — obtain a session token for authenticated writes. */
  async authenticate(
    username = 'admin',
    password = 'password123',
  ): Promise<string> {
    const res = await this.request.post('/auth', {
      data: { username, password },
    });
    expect(res.status(), 'auth should return 200').toBe(200);
    const body = (await res.json()) as { token?: string; reason?: string };
    expect(
      body.token,
      `auth failed: ${body.reason ?? 'no token returned'}`,
    ).toBeTruthy();
    this.token = body.token;
    return this.token as string;
  }

  private authHeaders(): Record<string, string> {
    if (!this.token) {
      throw new Error('Call authenticate() before an authenticated request.');
    }
    return { Cookie: `token=${this.token}` };
  }

  /** GET /ping — health check, returns 201 when the service is up. */
  async ping(): Promise<APIResponse> {
    return this.request.get('/ping');
  }

  /** GET /booking — list all booking ids (optionally filtered by name). */
  async getBookingIds(
    filter?: Partial<Pick<Booking, 'firstname' | 'lastname'>>,
  ): Promise<APIResponse> {
    return this.request.get('/booking', { params: filter });
  }

  /** GET /booking/:id — fetch a single booking. */
  async getBooking(id: number): Promise<APIResponse> {
    return this.request.get(`/booking/${id}`);
  }

  /** POST /booking — create a booking, returns { bookingid, booking }. */
  async createBooking(booking: Booking): Promise<APIResponse> {
    return this.request.post('/booking', { data: booking });
  }

  /** PUT /booking/:id — full replace (auth required). */
  async updateBooking(id: number, booking: Booking): Promise<APIResponse> {
    return this.request.put(`/booking/${id}`, {
      data: booking,
      headers: this.authHeaders(),
    });
  }

  /** PATCH /booking/:id — partial update (auth required). */
  async patchBooking(
    id: number,
    partial: Partial<Booking>,
  ): Promise<APIResponse> {
    return this.request.patch(`/booking/${id}`, {
      data: partial,
      headers: this.authHeaders(),
    });
  }

  /** DELETE /booking/:id — remove a booking (auth required). */
  async deleteBooking(id: number): Promise<APIResponse> {
    return this.request.delete(`/booking/${id}`, {
      headers: this.authHeaders(),
    });
  }

  /**
   * Convenience helper: create a booking and return the parsed id + payload,
   * asserting the happy path along the way. Useful as arrange-step setup.
   */
  async createBookingAndGetId(booking: Booking): Promise<CreatedBooking> {
    const res = await this.createBooking(booking);
    expect(res.status(), 'create should return 200').toBe(200);
    return (await res.json()) as CreatedBooking;
  }
}
