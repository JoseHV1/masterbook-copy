import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { EditClaimsComponent } from './edit-claims.component';
import { PagesLayoutModule } from '../../../shared/layouts/pages-layout/pages-layout.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormClaimsModule } from '../components/form-claims/form-claims.module';

const routes: Routes = [
  {
    path: '',
    component: EditClaimsComponent,
  },
];

@NgModule({
  declarations: [EditClaimsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PagesLayoutModule,
    MatTooltipModule,
    FormClaimsModule,
  ],
  exports: [EditClaimsComponent],
})
export class EditClaimsModule {}
