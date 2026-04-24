import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { finalize } from 'rxjs';
import { ModalUploadFileComponent } from '@app/shared/components/modal-upload-file/modal-upload-file.component';
import { UploadFileService } from './../../../services/upload_file.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { InsurerService } from 'src/app/shared/services/insurer.service';
import { hasError } from 'src/app/shared/helpers/has-error.helper.ts';
import { UploadFileRequest } from 'src/app/shared/interfaces/requests/upload-file/upload-file.request';

@Component({
  selector: 'app-tab-upload-file',
  templateUrl: './tab-upload-file.component.html',
  styleUrls: ['./tab-upload-file.component.scss'],
})
export class TabUploadFileComponent {
  @Output() uploadCompleted = new EventEmitter<void>();
  @Input() entity!: string;
  @ViewChild('inputFile') inputFile!: ElementRef;

  public form: FormGroup;
  public isLoading = false;
  public hasError = hasError;

  public readonly allowedTypes: string[] = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ];

  constructor(
    private _ui: UiService,
    private _uploadFile: UploadFileService,
    private _dialog: MatDialog,
    private _insurer: InsurerService
  ) {
    this.form = this._uploadFile.createNewUploadFileForm();
  }

  openModal(fileData?: any, insurers: any[] = []): void {
    const dialogRef = this._dialog.open(ModalUploadFileComponent, {
      width: '600px',
      panelClass: 'custom-dialog-container',
      data: {
        entity: this.entity,
        upload_file: fileData,
        insurers: insurers,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.processModalResult(result);
      }
    });
  }

  private processModalResult(result: any): void {
    const payload: UploadFileRequest = {
      file_name: result.upload_file.name,
      file_base64: result.upload_file.document,
      entity: this.entity,
    };

    if (this.entity === 'policies' && result.insurers_mapping) {
      payload.dictionary = result.insurers_mapping.map((item: any) => ({
        id: item.id,
        custom_name: item.custom_name,
      }));
    }

    this.sendToApi(payload);
  }

  uploadFile(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    if (!this.allowedTypes.includes(file.type)) {
      this._ui.showAlertError(
        'This file type is not allowed. Please use Excel files.'
      );
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result as string;
      const fileData = { name: file.name, document: base64 };

      if (this.entity === 'policies') {
        this.loadInsurersAndOpenModal(fileData);
      } else {
        this.sendToApi({
          file_name: file.name,
          file_base64: base64,
          entity: this.entity,
        });
      }
    };

    event.target.value = '';
  }

  private loadInsurersAndOpenModal(fileData: {
    name: string;
    document: string;
  }): void {
    this._ui.showLoader();
    this.isLoading = true;

    this._insurer
      .getInsurers()
      .pipe(
        finalize(() => {
          this._ui.hideLoader();
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (insurers: any[]) => {
          this.openModal(fileData, insurers);
        },
        error: () => {
          this._ui.showAlertError(
            'Could not load insurers list. Please try again.'
          );
        },
      });
  }

  private sendToApi(payload: any): void {
    this._ui.showLoader();
    this.isLoading = true;

    this._uploadFile
      .createUploadFile(payload)
      .pipe(
        finalize(() => {
          this._ui.hideLoader();
          this.isLoading = false;
        })
      )
      .subscribe({
        next: () => {
          this._ui.showAlertSuccess('The file has been uploaded successfully');
          this.uploadCompleted.emit();
        },
        error: () => this._ui.showAlertError('An error occurred during upload'),
      });
  }

  downloadTemplate(): void {
    const templates: Record<string, string> = {
      accounts:
        'https://my-masterbook-prod.s3.us-west-2.amazonaws.com/templates/accounts-template.xlsx',
      // 'https://accounts-template.s3.us-east-1.amazonaws.com/accounts-template.xlsx', //TODO ESTO ES PARA DEV Y PRUEBAS
      policies:
        'https://my-masterbook-prod.s3.us-west-2.amazonaws.com/templates/policies-template.xlsx',
      // 'https://policies-template.s3.us-east-1.amazonaws.com/policies-template.xlsx', //TODO ESTO ES PARA DEV Y PRUEBAS
    };

    const url = templates[this.entity];

    if (!url) {
      this._ui.showAlertError(`No template found for entity: ${this.entity}`);
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

  openNavigatorFile(): void {
    this.inputFile.nativeElement.click();
  }
}
