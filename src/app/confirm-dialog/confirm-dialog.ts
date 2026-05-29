import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.scss',
})
export class ConfirmDialogComponent {
  @Input() data!: ConfirmDialogData;
  @Output() confirmed = new EventEmitter<boolean>();

  onCancel(): void {
    this.confirmed.emit(false);
  }

  onConfirm(): void {
    this.confirmed.emit(true);
  }
}