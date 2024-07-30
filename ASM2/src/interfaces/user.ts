export interface User {
  id?: string | number;
  email: string;
  password: string;
  confirmPass: string;
  role: string | number;
}
