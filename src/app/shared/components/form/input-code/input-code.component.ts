import {
  Component,
  ElementRef,
  forwardRef,
  Input,
  OnDestroy,
  QueryList,
  ViewChildren,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { UiService } from '../../../services/ui.service';

@Component({
  selector: 'app-input-code',
  templateUrl: './input-code.component.html',
  styleUrls: ['./input-code.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputCodeComponent),
      multi: true,
    },
  ],
})
export class InputCodeComponent implements ControlValueAccessor, OnDestroy {
  @ViewChildren('code') arrayInputs!: QueryList<ElementRef>;
  @Input() type: string = 'number';
  destroy$: Subject<void> = new Subject();
  form: FormGroup;
  value!: string;

  constructor(private _ui: UiService) {
    this.form = new FormGroup({
      code1: new FormControl('', [Validators.required]),
      code2: new FormControl('', [Validators.required]),
      code3: new FormControl('', [Validators.required]),
      code4: new FormControl('', [Validators.required]),
      code5: new FormControl('', [Validators.required]),
      code6: new FormControl('', [Validators.required]),
    });

    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.value = Object.values(this.form.value).join('');
      this.onChange(parseInt(this.value));
    });
  }

  validateInput(e: KeyboardEvent, index: number) {
    const acceptedValues = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const acceptedKeys = ['Backspace', 'Delete'];
    const value: string = this.form.controls[`code${index}`].value;

    if (acceptedKeys.includes(e.key)) return;

    if (!(acceptedValues.includes(e.key) && value.length === 0)) {
      e.preventDefault();
    }
  }

  onChange: (value: any) => void | undefined = () => undefined;
  onTouch: (value: string) => void | undefined = () => undefined;

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  clearPlacehorder(index: number) {
    this.arrayInputs.toArray()[index - 1].nativeElement.placeholder = '';
  }

  fillPlacehorder(index: number) {
    this.arrayInputs.toArray()[index - 1].nativeElement.placeholder = 0;
  }

  changeFocus(index: number, event: KeyboardEvent, input: any) {
    const backFocusKeys = ['Backspace'];
    const codeRefs = this.arrayInputs.toArray();

    if (backFocusKeys.includes(event.key)) {
      if (index > 1) codeRefs[index - 2].nativeElement.focus();
      this.fillPlacehorder(index);
      return;
    }

    if (index < codeRefs.length) {
      if (input.value) codeRefs[index].nativeElement.focus();
    }
  }

  pasteCode(event: ClipboardEvent, index: number) {
    let totalLenghtCopied = 0;
    const acceptedValues = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const codeRefs = this.arrayInputs.toArray();
    const clipboardText = event.clipboardData?.getData('text');
    const refinedText = clipboardText
      ?.split('')
      .filter(key => acceptedValues.includes(key));

    event.preventDefault();

    if (refinedText && refinedText.length > 6) {
      totalLenghtCopied = 6;
    }

    if (refinedText && refinedText.length > 0 && refinedText.length <= 6) {
      totalLenghtCopied = refinedText.length;
    }

    for (let i = 0; i < totalLenghtCopied; i++) {
      const ind = index + i - 1;
      if (codeRefs[ind].nativeElement) {
        codeRefs[ind].nativeElement.value = refinedText ? refinedText[i] : '';
        this.form
          .get(`code${ind + 1}`)
          ?.patchValue(refinedText ? refinedText[i] : '');
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
