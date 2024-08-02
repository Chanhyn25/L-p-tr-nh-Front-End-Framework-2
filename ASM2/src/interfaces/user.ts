export interface User {
  id: number;
  email: string;
  name: string;
  phone: string;
  address: string;
  password: string;
  confirmPass: string;
  avatar: string;
  role: string | number;
}
