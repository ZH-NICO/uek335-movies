/**
 * User as returned by the backend (json-server-auth).
 * The additional fields are optional because accounts can also be created without them.
 * The password is left out on purpose: the app only sends it at login and never shows or stores it.
 */
export interface User {
  id: number;
  email: string;
  firstname?: string;
  lastname?: string;
  age?: number;
}
