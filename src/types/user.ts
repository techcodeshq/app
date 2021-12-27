import { Role } from "./role";

export interface User {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  osis: string | null;
  role: Role;
}
