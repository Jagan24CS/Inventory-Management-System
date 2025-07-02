import { Request, Response } from 'express';
import pool from '../config/db';
import { Supplier, RowDataPacket } from '../types/db.types';

// Helper function to transform RowDataPacket to Supplier
const mapRowToSupplier = (row: RowDataPacket): Supplier => ({
  id: row.id as number,
  name: row.name as string,
  email: row.email as string | null,
  phone: row.phone as string | null,
  address: row.address as string | null, // Changed from contact to address
  created_at: row.created_at ? new Date(row.created_at as string) : new Date(),
});

export const getAllSuppliers = async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM suppliers');
    const suppliers: Supplier[] = rows.map(mapRowToSupplier);
    res.json({ message: 'Suppliers retrieved successfully', data: suppliers });
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ error: 'Failed to fetch suppliers' });
  }
};

export const getSupplierById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM suppliers WHERE id = ?', [id]);
    const suppliers: Supplier[] = rows.map(mapRowToSupplier);

    if (suppliers.length === 0) {
      res.status(404).json({ error: 'Supplier not found' });
      return;
    }

    res.json({ message: 'Supplier retrieved successfully', data: suppliers[0] });
  } catch (error) {
    console.error('Error fetching supplier:', error);
    res.status(500).json({ error: 'Failed to fetch supplier' });
  }
};

export const createSupplier = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, address } = req.body; // Changed from contactInfo to address

    if (!name) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }
    if (name.length > 255) {
      res.status(400).json({ error: 'Name cannot exceed 255 characters' });
      return;
    }
    if (email && email.length > 255) {
      res.status(400).json({ error: 'Email cannot exceed 255 characters' });
      return;
    }
    if (phone && phone.length > 255) {
      res.status(400).json({ error: 'Phone cannot exceed 255 characters' });
      return;
    }
    if (address && address.length > 255) {
      res.status(400).json({ error: 'Address cannot exceed 255 characters' }); // Updated message
      return;
    }

    const [result] = await pool.query<RowDataPacket[]>(
      'INSERT INTO suppliers (name, email, phone, address) VALUES (?, ?, ?, ?)', // Changed contact to address
      [name, email ?? null, phone ?? null, address ?? null]
    );

    const [newRows] = await pool.query<RowDataPacket[]>('SELECT * FROM suppliers WHERE id = ?', [(result as any).insertId]);
    const newSupplier: Supplier = mapRowToSupplier(newRows[0]);

    res.status(201).json({ message: 'Supplier created successfully', data: newSupplier });
  } catch (error) {
    console.error('Error creating supplier:', error);
    res.status(500).json({ error: 'Failed to create supplier', details: error });
  }
};

export const updateSupplier = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email, phone, address } = req.body; // Changed from contactInfo to address

    const [check] = await pool.query<RowDataPacket[]>('SELECT * FROM suppliers WHERE id = ?', [id]);
    const suppliers: Supplier[] = check.map(mapRowToSupplier);
    if (suppliers.length === 0) {
      res.status(404).json({ error: 'Supplier not found' });
      return;
    }

    if (!name) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }
    if (name.length > 255) {
      res.status(400).json({ error: 'Name cannot exceed 255 characters' });
      return;
    }
    if (email && email.length > 255) {
      res.status(400).json({ error: 'Email cannot exceed 255 characters' });
      return;
    }
    if (phone && phone.length > 255) {
      res.status(400).json({ error: 'Phone cannot exceed 255 characters' });
      return;
    }
    if (address && address.length > 255) {
      res.status(400).json({ error: 'Address cannot exceed 255 characters' }); // Updated message
      return;
    }

    await pool.query(
      'UPDATE suppliers SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?', // Changed contact to address
      [name, email ?? null, phone ?? null, address ?? null, id]
    );

    const [updatedRows] = await pool.query<RowDataPacket[]>('SELECT * FROM suppliers WHERE id = ?', [id]);
    const updatedSupplier: Supplier = mapRowToSupplier(updatedRows[0]);

    res.json({
      message: 'Supplier updated successfully',
      data: updatedSupplier,
    });
  } catch (error) {
    console.error('Error updating supplier:', error);
    res.status(500).json({ error: 'Failed to update supplier' });
  }
};

export const deleteSupplier = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const [check] = await pool.query<RowDataPacket[]>('SELECT * FROM suppliers WHERE id = ?', [id]);
    const suppliers: Supplier[] = check.map(mapRowToSupplier);
    if (suppliers.length === 0) {
      res.status(404).json({ error: 'Supplier not found' });
      return;
    }

    await pool.query('UPDATE inventory SET supplier_id = NULL WHERE supplier_id = ?', [id]);
    await pool.query('DELETE FROM suppliers WHERE id = ?', [id]);

    res.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    res.status(500).json({ error: 'Failed to delete supplier' });
  }
};