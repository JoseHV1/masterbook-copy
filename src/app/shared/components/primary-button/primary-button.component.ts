import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-primary-button',
  templateUrl: './primary-button.component.html',
  styleUrls: ['./primary-button.component.scss'],
})
export class PrimaryButtonComponent {
  @Input() text = '';
  @Input() disabled = false;
  @Input() set background(data: string) {
    this._background = data;
    this.backgroundOutline = `${this._background}-outline`;
  }
  @Input() type: 'normal' | 'outline' = 'normal';
  _background: string = 'blue-primary';
  backgroundOutline!: string;
  @Output() clickEvent = new EventEmitter<void>();
}
