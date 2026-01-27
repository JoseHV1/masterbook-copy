import { Component, Input, OnDestroy } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NgControl,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Editor, toDoc, toHTML, Toolbar } from 'ngx-editor';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-rich-text-input',
  templateUrl: './rich-text-input.component.html',
  styleUrls: ['./rich-text-input.component.scss'],
})
export class RichTextInputComponent implements ControlValueAccessor, OnDestroy {
  destroy: Record<string, Subscription | undefined> = {};
  editor: Editor = new Editor();
  defaultConfig: RichTextConfig = [
    ['ordered_list', 'bullet_list'],
    ['bold', 'italic', 'underline'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
  ];
  toolbar: Toolbar = this.defaultConfig as Toolbar;

  @Input() set disabled(data: boolean) {
    this.setDisabledState(data);
  }
  @Input() set config(data: RichTextConfig) {
    this.toolbar = data as Toolbar;
  }

  form: FormGroup;
  errors: string[] = [];
  errorMessage = '';

  onChange = (_: any) => {};
  onTouched = () => {};

  constructor(
    public currentControl: NgControl,
    private _translate: TranslateService
  ) {
    this.currentControl.valueAccessor = this;

    this.form = new FormGroup({
      value: new FormControl(null),
    });

    this.destroy['sub'] = this.form
      .get('value')
      ?.valueChanges.subscribe(() => this.changeValue());
  }

  changeValue(): void {
    const rawValue = this.form.get('value')?.value;
    const value = toHTML(rawValue);
    this.onChange(value);
    this.updateErrors();
  }

  updateErrors(): void {
    if (this.currentControl) {
      const controlErrors = this.currentControl.errors;
      this.errors = Object.keys(controlErrors ?? {}).map(err =>
        err.toUpperCase()
      );

      this.form.get('value')?.setErrors(controlErrors);

      this.errorMessage = this.errors.length
        ? this._translate.instant(`FORM_ERROR.${this.errors[0]}`)
        : '';
    }
  }

  writeValue(value: string): void {
    this.form.get('value')?.setValue(toDoc(value), { emitEvent: false });
    this.updateErrors();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled
      ? this.form.get('value')?.disable()
      : this.form.get('value')?.enable();
  }

  ngOnDestroy(): void {
    Object.values(this.destroy).forEach(sub => sub?.unsubscribe());
  }
}

export type RichTextHeadingOption = {
  heading: string[];
};

export type RichTextConfig = (string | RichTextHeadingOption)[][];
