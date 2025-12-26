import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-primary-button',
  templateUrl: './primary-button.component.html',
  styleUrls: ['./primary-button.component.scss'],
})
export class PrimaryButtonComponent implements OnInit {
  @Input() text = '';
  @Input() background: 'blue-primary' | 'blue-dark' | 'orange' = 'blue-primary';
  @Input() type: 'normal' | 'outline' = 'normal';
  backgroundOutline!: string;
  @Output() clickEvent = new EventEmitter<void>();

  ngOnInit(): void {
    if (this.type === 'outline')
      this.backgroundOutline = `${this.background}-outline`;
  }
}
