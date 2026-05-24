import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-choose-role',
  imports: [CommonModule],
  templateUrl: './choose-role.html',
  styleUrl: './choose-role.scss'
})
export class ChooseRole {
  @Output() closed = new EventEmitter<void>();
  @Output() roleSelected = new EventEmitter<'company' | 'worker'>();

  selectRole(role: 'company' | 'worker') {
    this.roleSelected.emit(role);
    this.closed.emit();
  }

  close() {
    this.closed.emit();
  }
}