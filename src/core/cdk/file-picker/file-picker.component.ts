import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NgControl,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FileInfoModel } from 'src/app/shared/interfaces/models/file-info.model';
import { FilePipe } from 'src/app/shared/pipes/file.pipe';
import { UiService } from 'src/app/shared/services/ui.service';

@Component({
  selector: 'app-file-picker',
  templateUrl: './file-picker.component.html',
  styleUrls: ['./file-picker.component.scss'],
})
export class FilePickerComponent implements ControlValueAccessor {
  @ViewChild('inputFile') inputFile!: ElementRef;
  @Input() placeholder: string = '';
  @Input() maxMbAllowed: number = 10;
  @Input() allowedTypes: string[] = ['pdf', 'application/pdf'];
  @Input() mode: fileUploadMode = fileUploadMode.INPUT;

  form: FormGroup;
  errors: string[] = [];
  errorMessage = '';
  fileUploadMode = fileUploadMode;
  pipe = new FilePipe();

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

      const fileInfo = {
        weight: file.size,
        name: file.name.split('.').slice(0, -1).join('.'),
        extension: file.name.split('.').pop()?.toLowerCase() || '',
        document: result,
      };
      this.form.get('value')?.setValue(this.pipe.transform(fileInfo));
      this.changeValue(fileInfo);
      this.inputFile.nativeElement.value = null;
    };
  }

  changeValue(valueToEmit: FileInfoModel): void {
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

  writeValue(value: string | FileInfoModel): void {
    this.form.get('value')?.setValue(this.pipe.transform(value));
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
