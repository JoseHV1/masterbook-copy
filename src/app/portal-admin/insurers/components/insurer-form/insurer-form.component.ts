import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { InsurerModel, CreateInsurerRequest } from 'src/app/shared/interfaces/models/insurer.model';
import { TenantsService } from 'src/app/shared/services/tenants.service';
import { TenantStatusEnum } from 'src/app/shared/enums/tenant-status.enum';

@Component({
  selector: 'app-insurer-form',
  templateUrl: './insurer-form.component.html',
  styleUrls: ['./insurer-form.component.scss'],
})
export class InsurerFormComponent implements OnInit, OnDestroy {
  @Input() insurer: InsurerModel | null = null;
  @Output() formSubmit = new EventEmitter<CreateInsurerRequest>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;
  tenantOptions: { name: string; code: string }[] = [];
  private _destroy$ = new Subject<void>();

  constructor(
    private _fb: FormBuilder,
    private _tenants: TenantsService,
  ) {}

  ngOnInit(): void {
    this._buildForm();
    if (this.insurer) this._patchForm(this.insurer);
    this._loadTenants();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _buildForm(): void {
    this.form = this._fb.group({
      name:         [null, [Validators.required]],
      email:        [null],
      country:      [null],
      ein:          [null],
      phone_number: [null],
      fax:          [null],
      logo_url:     [null],
      tenant_ids:   [[]],
    });
  }

  private _patchForm(insurer: InsurerModel): void {
    this.form.patchValue({
      name:         insurer.name,
      email:        insurer.email,
      country:      insurer.country,
      ein:          insurer.ein,
      phone_number: insurer.phone_number,
      fax:          insurer.fax,
      logo_url:     insurer.logo_url,
      tenant_ids:   insurer.tenant_ids ?? [],
    });
  }

  private _loadTenants(): void {
    this._tenants
      .getAll(0, 100, `&status=${TenantStatusEnum.ACTIVE}`)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: resp => {
          this.tenantOptions = resp.records.map(t => ({
            name: `${t.name} (${t.code})`,
            code: t._id,
          }));
        },
      });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.formSubmit.emit(this.form.getRawValue());
  }

  isInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!(c?.invalid && c?.touched);
  }
}
