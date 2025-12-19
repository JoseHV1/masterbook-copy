import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-anon-modal',
  templateUrl: './anon-modal.component.html',
  styleUrls: ['./anon-modal.component.scss'],
})
export class AnonModalComponent {
  @Input() width!: number;
  @Input() height!: number;
  @Input() hideClose: boolean = false;
  @Input() visible!: boolean;
  @Input() clasable: boolean = true;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
}
