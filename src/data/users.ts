/**
 * SauceDemo test accounts. All accounts share the same password.
 * See https://www.saucedemo.com for the canonical list.
 */
export interface Credentials {
  readonly username: string;
  readonly password: string;
}

const PASSWORD = 'secret_sauce';

export const users = {
  standard: { username: 'standard_user', password: PASSWORD },
  lockedOut: { username: 'locked_out_user', password: PASSWORD },
  problem: { username: 'problem_user', password: PASSWORD },
  performanceGlitch: {
    username: 'performance_glitch_user',
    password: PASSWORD,
  },
  error: { username: 'error_user', password: PASSWORD },
  visual: { username: 'visual_user', password: PASSWORD },
} as const satisfies Record<string, Credentials>;

export type UserKey = keyof typeof users;
