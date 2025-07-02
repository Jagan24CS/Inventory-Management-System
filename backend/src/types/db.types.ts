import { RowDataPacket } from 'mysql2';

export interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  supplier_id: number | null;
  created_at: Date;
}

export interface Supplier {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null; // Changed from contact to address
  created_at: Date;
}

export { RowDataPacket };