import { FormRequestsFromPolicyModule } from './../../components/form-requests-from-policy/form-requests-from-policy.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';
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
    TranslateModule,
    CommonModule,
    RouterModule.forChild(routes),
    PagesLayoutModule,
    FormNewBusinessModule,
    FormRequestsFromPolicyModule,
    MatTooltipModule,
  ],
  exports: [EditRequestComponent],
})
export class EditRequestModule {}
