import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NgControl,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { UiService } from 'src/app/shared/services/ui.service';
/**
 * @deprecated Este input esta deprecado, utiliza el file-picker
 */
@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent implements ControlValueAccessor {
  @ViewChild('inputFile') inputFile!: ElementRef;
  @Input() placeholder: string = '';
  @Input() maxMbAllowed: number = 10;
  @Input() allowedTypes: string[] = ['pdf', 'application/pdf'];
  @Input() mode: fileUploadMode = fileUploadMode.INPUT;

  form: FormGroup;
  errors: string[] = [];
  errorMessage = '';
  fileUploadMode = fileUploadMode;

  onChange = (_: any) => {};
  onTouched = () => {};

  constructor(
    public currentControl: NgControl,
    private _translate: TranslateService,
    private _ui: UiService
  ) {
    this.currentControl.valueAccessor = this;
    this.form = new FormGroup({
      value: new FormControl(null, []),
    });
  }

  get allowedTypesString(): string {
    return this.allowedTypes.map(type => `.${type}`).join(', ');
  }

  openNavigatorFile() {
    this.inputFile.nativeElement.click();
  }

  addFile(event: any) {
    const reader = new FileReader();
    const file = event.target.files[0] ?? null;

    if (!file) return;

    if (file?.size / 1048576 > this.maxMbAllowed) {
      this._ui.showAlertError(
        `The maximum weight allowed is ${this.maxMbAllowed} MB`
      );
      return;
    }

    if (!this.allowedTypes.includes(file?.type)) {
      this._ui.showAlertError('This file type is not allowed');
      return;
    }

    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const result = reader.result as string;
      this.form.get('value')?.setValue(file.name);
      this.changeValue(result);
      this.inputFile.nativeElement.value = null;
    };
  }

  changeValue(valueToEmit: string): void {
    this.onChange(valueToEmit);
    this.updateErrors();
  }

  updateErrors(): void {
    this.errors = Object.keys(this.currentControl.errors ?? {}).map(err =>
      err.toUpperCase()
    );
    this.form.get('value')?.setErrors(this.currentControl.errors);
    this.errorMessage = this.errors.length
      ? this._translate.instant(`FORM_ERROR.${this.errors[0]}`)
      : '';
  }

  writeValue(value: any): void {
    this.form.get('value')?.setValue(value);
    this.updateErrors();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled
      ? this.form.get('value')?.disable()
      : this.form.get('value')?.enable();
  }
}

export enum fileUploadMode {
  INPUT = 'INPUT',
  ICON = 'ICON',
}
