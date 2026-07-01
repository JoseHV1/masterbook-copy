import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TenantFormComponent } from './tenant-form.component';
import { CDKModule } from 'src/core/cdk/cdk.module';

@NgModule({
  declarations: [TenantFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CDKModule,
    TranslateModule,
    MatTooltipModule,
  ],
  exports: [TenantFormComponent],
})
export class TenantFormModule {}
