import { FormRequestsFromPolicyModule } from './../../components/form-requests-from-policy/form-requests-from-policy.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditRequestComponent } from './edit-request.component';
import { RouterModule, Routes } from '@angular/router';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { FormNewBusinessModule } from '../../components/form-new-business/form-new-business.module';

const routes: Routes = [
  {
    path: '',
    component: EditRequestComponent,
  },
];

@NgModule({
  declarations: [EditRequestComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PagesLayoutModule,
    FormNewBusinessModule,
    FormRequestsFromPolicyModule,
  ],
  exports: [EditRequestComponent],
})
export class EditRequestModule {}
