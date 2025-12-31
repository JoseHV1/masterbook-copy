import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InsurerModel } from '@app/shared/interfaces/models/insurer.model';
import { InsurerConfigService } from '@app/shared/services/insurer-config.service';
import { PoliciesService } from '@app/shared/services/policies.service';

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

  ngOnInit(): void {
    if (this.entity === 'policies') {
      this._insurer.getInsurers(0, 100, '').subscribe(resp => {
        this.insurers = resp.records;
        this.buildInsurerFields();
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
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.value);
  }
}
