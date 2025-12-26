import { UploadFileService } from './../../../services/upload_file.service';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { finalize } from 'rxjs';
import { hasError } from 'src/app/shared/helpers/has-error.helper.ts';
import { UploadFileRequest } from 'src/app/shared/interfaces/requests/upload-file/upload-file.request';
import { UiService } from 'src/app/shared/services/ui.service';

@Component({
  selector: 'app-tab-upload-file',
  templateUrl: './tab-upload-file.component.html',
  styleUrls: ['./tab-upload-file.component.scss'],
})
export class TabUploadFileComponent {
  @Output() uploadCompleted = new EventEmitter<void>();
  @Input() entity!: string;
  @ViewChild('inputFile') inputFile!: ElementRef;
  allowedTypes: string[] = [
    '.xlsx',
    '.xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];
  isLoading = false;
  form!: FormGroup;
  hasError = hasError;

  constructor(private _ui: UiService, private _uploadFile: UploadFileService) {
    this.form = this._uploadFile.createNewUploadFileForm();
  }

  downloadTemplate() {
    const templates: Record<string, string> = {
      accounts:
        'https://accounts-template.s3.us-east-1.amazonaws.com/accounts-template.xlsx',
      policies:
        'https://policies-template.s3.us-east-1.amazonaws.com/policies-template.xlsx',
    };

    const url = templates[this.entity];

    if (!url) {
      this._ui.showAlertError(`No template found for: ${this.entity}`);
      return;
    }

    const link = document.createElement('a');
    link.href = url;
    link.download = `${this.entity}-template.xlsx`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  openNavigatorFile() {
    this.inputFile.nativeElement.click();
  }

  uploadFile(event: any) {
    const reader = new FileReader();
    const file = event.target.files[0] ?? null;

    if (!file) return;

    if (!this.allowedTypes.includes(file?.type)) {
      this._ui.showAlertError('This file type is not allowed');
      return;
    }

    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const result = reader.result as string;
      this.form.get('file_base64')?.setValue(result);
      this.form.get('file_name')?.setValue(file.name);
    };

    event.target.value = '';
    this._ui.showAlertSuccess('The file has been successfully uploaded');
  }

  sendData() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
    if (this.form.invalid) return;

    const req: UploadFileRequest = {
      file_name: this.form.value.file_name,
      file_base64: this.form.value.file_base64,
      entity: this.entity,
    };

    this._ui.showLoader();
    this._uploadFile
      .createUploadFile(req)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(() => {
        this._ui.showAlertSuccess('The file has been uploaded successfully');
        this.uploadCompleted.emit();
      });
  }
}
