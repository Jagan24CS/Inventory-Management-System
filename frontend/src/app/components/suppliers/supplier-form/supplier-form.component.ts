import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupplierService } from '../../../services/supplier.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-supplier-form',
  templateUrl: './supplier-form.component.html',
  styleUrls: ['./supplier-form.component.css']
})
export class SupplierFormComponent implements OnInit {
  supplierForm: FormGroup;
  supplierId: number | null = null;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private supplierService: SupplierService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.supplierForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.email]],
      phone: [''],
      address: [''] // Changed from contact to address
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.supplierId = +id;
        this.isEditMode = true;
        this.loadSupplier();
      }
    });
  }

  loadSupplier(): void {
    if (this.supplierId) {
      this.supplierService.getById(this.supplierId).subscribe({
        next: (response) => {
          this.supplierForm.patchValue(response.data);
        },
        error: () => {
          this.snackBar.open('Failed to load supplier', 'Close', { duration: 3000 });
        }
      });
    }
  }

  onSubmit(): void {
    if (this.supplierForm.invalid) {
      this.snackBar.open('Please fill in all required fields', 'Close', { duration: 3000 });
      return;
    }

    const supplier = this.supplierForm.value;
    if (this.isEditMode && this.supplierId) {
      this.supplierService.update(this.supplierId, supplier).subscribe({
        next: () => {
          this.snackBar.open('Supplier updated successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/suppliers']);
        },
        error: () => {
          this.snackBar.open('Failed to update supplier', 'Close', { duration: 3000 });
        }
      });
    } else {
      this.supplierService.create(supplier).subscribe({
        next: () => {
          this.snackBar.open('Supplier added successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/suppliers']);
        },
        error: () => {
          this.snackBar.open('Failed to add supplier', 'Close', { duration: 3000 });
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/suppliers']);
  }
}