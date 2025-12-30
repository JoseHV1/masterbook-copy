import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InsurerModel } from '@app/shared/interfaces/models/insurer.model';
import { InsurerConfigService } from '@app/shared/services/insurer-config.service';
import { PoliciesService } from '@app/shared/services/policies.service';
import { UiService } from '@app/shared/services/ui.service';

@Component({
  selector: 'app-modal-ticket',
  templateUrl: './modal-upload-file.component.html',
  styleUrls: ['./modal-upload-file.component.scss'],
})
export class ModalUploadFileComponent implements OnInit {
  insurers: InsurerModel[] = [];
  form!: FormGroup;
  entity!: string;
  allowedTypes: string[] = [
    'xlsx',
    'xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];

  constructor(
    private _ui: UiService,
    private _insurer: InsurerConfigService,
    private _policy: PoliciesService,
    private dialogRef: MatDialogRef<ModalUploadFileComponent>,
    @Inject(MAT_DIALOG_DATA) public dataModal: { entity: string }
  ) {
    this.form = this._policy.createUploadFileForm();
    this.entity = dataModal.entity;
  }

  get insurersArray(): FormArray {
    return this.form.get('insurers_mapping') as FormArray;
  }

  get isInvalidForm(): boolean {
    if (this.entity === 'policies') {
      return this.form.invalid || this.insurers.length === 0;
    }
    return this.form.invalid;
  }

  ngOnInit(): void {
    if (this.entity === 'policies') {
      this._insurer.getInsurersWithConfig().subscribe(resp => {
        this.insurers = resp || [];
        if (this.insurers.length > 0) {
          this.buildInsurerFields();
        } else {
          this._ui.showAlertError(
            'No insurers configured. You need to have at least 1 insurer to proceed'
          );
        }
      });
    }
  }

  buildInsurerFields() {
    this.insurers.forEach(ins => {
      this.insurersArray.push(
        new FormGroup({
          id: new FormControl(ins._id),
          name: new FormControl(ins.name),
          custom_name: new FormControl(''),
        })
      );
    });
  }

  save() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
    if (this.isInvalidForm) return;

    this.dialogRef.close(this.form.value);
  }
}
