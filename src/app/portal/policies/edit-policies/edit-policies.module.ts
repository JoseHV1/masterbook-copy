import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    CommonModule,
    RouterModule.forChild(routes),
    PagesLayoutModule,
    PolicyFormModule,
    ReactiveFormsModule,
  ],
  exports: [EditPoliciesComponent],
})
export class EditPoliciesModule {}
