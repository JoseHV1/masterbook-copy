import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-link-button',
  templateUrl: './link-button.component.html',
  styleUrls: ['./link-button.component.scss'],
})
export class LinkButtonComponent {
  @Input() text = '';
  @Input() color: 'white' | 'gray-1' | 'gray-2' = 'white';
  @Output() clickEvent = new EventEmitter<void>();
}
