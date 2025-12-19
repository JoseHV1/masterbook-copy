import {
  Component,
  Input,
  ChangeDetectionStrategy,
  SimpleChanges,
  OnChanges,
} from '@angular/core';

@Component({
  selector: 'app-button',
  template: `
    <button
      mat-button
      [ngClass]="combinedClasses"
      [disabled]="disabled"
      [type]="type">
      {{ label }}
    </button>
  `,
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush, // Improve performance if inputs are immutable
})
export class ButtonComponent implements OnChanges {
  @Input() label: string = 'Click Me';
  @Input() stylingClasses: string | string[] = '';
  @Input() disabled: boolean = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() buttonType: 'raised' | 'flat' | 'stroked' | 'icon' | 'basic' =
    'raised';

  ngOnChanges(changes: SimpleChanges) {
    if (changes['disabled']) {
      console.log('Disabled state updated:', changes['disabled'].currentValue);
      console.log(this.combinedClasses);
    }
  }

  getButtonClass(): string {
    switch (this.buttonType) {
      case 'raised':
        return 'mat-raised-button';
      case 'flat':
        return 'mat-flat-button';
      case 'stroked':
        return 'mat-stroked-button';
      case 'icon':
        return 'mat-icon-button';
      case 'basic':
        return 'mat-button';
      default:
        return 'mat-button';
    }
  }

  get combinedClasses(): string {
    const baseClass = 'app-input';
    const additionalClasses = Array.isArray(this.stylingClasses)
      ? this.stylingClasses
      : this.stylingClasses.split(' ').filter(cls => cls.trim() !== '');
    return [baseClass, ...additionalClasses].join(' '); // Convert to space-separated string
  }
}
