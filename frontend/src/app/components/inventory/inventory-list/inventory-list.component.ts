import { Component, OnInit, OnDestroy } from '@angular/core';
import { InventoryService } from '../../../services/inventory.service';
import { SupplierService } from '../../../services/supplier.service';
import { InventoryItem } from '../../../models/inventory-item.model';
import { Supplier } from '../../../models/supplier.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.css']
})
export class InventoryListComponent implements OnInit, OnDestroy {
  inventoryItems: InventoryItem[] = [];
  originalInventoryItems: InventoryItem[] = []; // To store the unfiltered list
  suppliers: Supplier[] = [];
  displayedColumns: string[] = ['id', 'name', 'category', 'quantity', 'supplier', 'actions'];
  private destroy$ = new Subject<void>();

  constructor(
    private inventoryService: InventoryService,
    private supplierService: SupplierService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    console.log('InventoryListComponent constructor called');
  }

  ngOnInit(): void {
    console.log('InventoryListComponent initialized');
    this.loadInventory();
    this.loadSuppliers();
  }

  loadInventory(): void {
    console.log('Fetching inventory from:', this.inventoryService['apiUrl'] + '/inventory');
    this.inventoryService.getAll().pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        console.log('Inventory Response:', response);
        this.inventoryItems = response.data || [];
        this.originalInventoryItems = [...this.inventoryItems]; // Keep a copy for filtering
        console.log('Inventory Items:', this.inventoryItems);
        if (this.inventoryItems.length === 0) {
          this.snackBar.open('No inventory items available', 'Close', { duration: 3000 });
        }
      },
      error: (error) => {
        console.error('Error loading inventory:', error);
        this.snackBar.open('Failed to load inventory', 'Close', { duration: 3000 });
      }
    });
  }

  loadSuppliers(): void {
    console.log('Fetching suppliers from:', this.supplierService['apiUrl'] + '/suppliers');
    this.supplierService.getAll().pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        console.log('Suppliers Response:', response);
        this.suppliers = response.data || [];
        console.log('Suppliers:', this.suppliers);
      },
      error: (error) => {
        console.error('Error loading suppliers:', error);
        this.snackBar.open('Failed to load suppliers', 'Close', { duration: 3000 });
      }
    });
  }

  getSupplierName(supplierId: number | null | undefined): string {
    if (!supplierId) return 'None';
    const supplier = this.suppliers.find(s => s.id === supplierId);
    return supplier ? supplier.name : 'Unknown';
  }

  deleteItem(id: number): void {
    if (confirm('Are you sure you want to delete this item?')) {
      this.inventoryService.delete(id).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.snackBar.open('Inventory item deleted', 'Close', { duration: 3000 });
          this.loadInventory();
        },
        error: () => {
          this.snackBar.open('Failed to delete item', 'Close', { duration: 3000 });
        }
      });
    }
  }

  editItem(id: number): void {
    this.router.navigate([`/inventory/edit/${id}`]);
  }

  addInventory(): void {
    if (this.suppliers.length === 0) {
      this.snackBar.open('Cannot add inventory: No suppliers available', 'Close', { duration: 3000 });
      return;
    }
    this.router.navigate(['/inventory/add']);
  }

  applyFilter(filters: { category?: string; stock?: string }): void {
    console.log('Applying filters:', filters);
    let filteredItems = [...this.originalInventoryItems];

    // Filter by category
    if (filters.category && filters.category !== 'all') {
      filteredItems = filteredItems.filter(item => item.category === filters.category);
    }

    // Filter by stock level
    if (filters.stock && filters.stock !== 'all') {
      if (filters.stock === 'low') {
        filteredItems = filteredItems.filter(item => item.quantity < 10);
      } else if (filters.stock === 'high') {
        filteredItems = filteredItems.filter(item => item.quantity >= 10);
      }
    }

    this.inventoryItems = filteredItems;
    console.log('Filtered Inventory Items:', this.inventoryItems);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}