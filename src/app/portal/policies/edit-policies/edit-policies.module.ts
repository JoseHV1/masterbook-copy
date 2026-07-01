import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EditPoliciesComponent } from './edit-policies.component';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { PolicyFormModule } from '../components/policy-form/policy-form.module';

const routes: Routes = [
  {
    path: '',
    component: EditPoliciesComponent,
  },
];

@NgModule({
  declarations: [EditPoliciesComponent],
  imports: [
    TranslateModule,
    CommonModule,
    RouterModule.forChild(routes),
    PagesLayoutModule,
    PolicyFormModule,
    ReactiveFormsModule,
    MatTooltipModule,
  ],
  exports: [EditPoliciesComponent],
})
export class EditPoliciesModule {}
