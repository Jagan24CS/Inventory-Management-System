import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-inventory-filters',
  templateUrl: './inventory-filters.component.html',
  styleUrls: ['./inventory-filters.component.css']
})
export class InventoryFiltersComponent {
  @Output() filterChange = new EventEmitter<{ category?: string; stock?: string }>();
  categories: string[] = ['all', 'Electronics', 'Furniture', 'Clothing','Others'];
  stockLevels: string[] = ['all', 'low', 'high'];
  selectedCategory: string = 'all';
  selectedStock: string = 'all';

  onCategoryChange(): void {
    this.emitFilters();
  }

  onStockChange(): void {
    this.emitFilters();
  }

  private emitFilters(): void {
    this.filterChange.emit({
      category: this.selectedCategory,
      stock: this.selectedStock
    });
  }
}