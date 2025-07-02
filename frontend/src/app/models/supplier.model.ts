export interface Supplier {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null; 
  created_at: string;
}