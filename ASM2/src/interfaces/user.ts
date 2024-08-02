export interface User {
  id: number;
  email: string;
  name: string;
  phone: string;
  address: string;
  password: string;
  confirmPass: string;
  role: string | number;
}
