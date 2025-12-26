import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-secondary-button',
  templateUrl: './secondary-button.component.html',
  styleUrls: ['./secondary-button.component.scss'],
})
export class SecondaryButtonComponent {
  @Input() text = '';
  @Input() color: 'blue-primary' | 'blue-dark' | 'orange' = 'blue-primary';
  @Output() clickEvent = new EventEmitter<void>();
}
