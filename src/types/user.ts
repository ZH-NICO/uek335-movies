// User as returned by the backend (json-server-auth).
// The additional fields are optional because accounts can also be created without them.
export interface User {
  id: number;
  email: string;
  firstname?: string;
  lastname?: string;
  age?: number;
}
