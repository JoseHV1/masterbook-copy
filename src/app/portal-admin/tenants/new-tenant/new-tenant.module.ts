import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';
import { NewTenantComponent } from './new-tenant.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { TenantFormModule } from '../components/tenant-form/tenant-form.module';

const routes: Routes = [{ path: '', component: NewTenantComponent }];

@NgModule({
  declarations: [NewTenantComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    MatTooltipModule,
    PagesLayoutModule,
    TenantFormModule,
  ],
})
export class NewTenantModule {}
