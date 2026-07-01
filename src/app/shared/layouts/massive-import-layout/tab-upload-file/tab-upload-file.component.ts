import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Subject, takeUntil, finalize } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { ModalUploadFileComponent } from '@app/shared/components/modal-upload-file/modal-upload-file.component';
import { UploadFileService } from './../../../services/upload_file.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { InsurerService } from 'src/app/shared/services/insurer.service';
import { TenantsService } from 'src/app/shared/services/tenants.service';
import { hasError } from 'src/app/shared/helpers/has-error.helper';
import { UploadFileRequest } from 'src/app/shared/interfaces/requests/upload-file/upload-file.request';
import { TenantModel } from 'src/app/shared/interfaces/models/tenant.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tab-upload-file',
  templateUrl: './tab-upload-file.component.html',
  styleUrls: ['./tab-upload-file.component.scss'],
})
export class TabUploadFileComponent implements OnInit, OnDestroy {
  @Output() uploadCompleted = new EventEmitter<void>();
  @Input() entity!: string;
  @ViewChild('inputFile') inputFile!: ElementRef;

  public form: FormGroup;
  public isLoading = false;
  public hasError = hasError;
  private _agencyTenant: TenantModel | null = null;
  private _destroy$ = new Subject<void>();

  public readonly allowedTypes: string[] = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ];

  constructor(
    private _ui: UiService,
    private _uploadFile: UploadFileService,
    private _dialog: MatDialog,
    private _insurer: InsurerService,
    private _tenants: TenantsService,
    private _t: TranslateService,
  ) {
    this.form = this._uploadFile.createNewUploadFileForm();
  }

  ngOnInit(): void {
    this._tenants.getForCurrentAgency()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: tenant => (this._agencyTenant = tenant),
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
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

    if (!this.hasTemplate) {
      this._ui.showAlertError(this._t.instant('SHARED.FILE.BULK_UPLOAD_UNAVAILABLE'));
      event.target.value = '';
      return;
    }

    if (!this.allowedTypes.includes(file.type)) {
      this._ui.showAlertError(this._t.instant('SHARED.FILE.TYPE_NOT_ALLOWED_EXCEL'));
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
          this._ui.showAlertError(this._t.instant('SHARED.FILE.LOAD_INSURERS_ERROR'));
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
          this._ui.showAlertSuccess(this._t.instant('SHARED.FILE.UPLOAD_SUCCESS'));
          this.uploadCompleted.emit();
        },
        error: () => this._ui.showAlertError(this._t.instant('SHARED.FILE.UPLOAD_ERROR')),
      });
  }

  get hasTemplate(): boolean {
    return this.entity === 'accounts'
      ? !!this._agencyTenant?.accounts_template_url
      : !!this._agencyTenant?.policies_template_url;
  }

  downloadTemplate(): void {
    const url = this.entity === 'accounts'
      ? this._agencyTenant?.accounts_template_url
      : this._agencyTenant?.policies_template_url;

    if (!url) {
      this._ui.showAlertError(this._t.instant('SHARED.FILE.BULK_UPLOAD_UNAVAILABLE'));
      return;
    }

    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  openNavigatorFile(): void {
    this.inputFile.nativeElement.click();
  }
}
