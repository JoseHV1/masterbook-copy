import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewRequestComponent } from './new-request.component';
import { RouterModule, Routes } from '@angular/router';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { TypeSelectorModule } from 'src/app/shared/components/type-selector/type-selector.module';
import { RequesTypeSelectorModule } from 'src/app/shared/components/request-type-selector/request-type-selector.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CDKModule } from 'src/core/cdk/cdk.module';
import { FormRequestsFromPolicyModule } from '../../components/form-requests-from-policy/form-requests-from-policy.module';
import { FormNewBusinessModule } from '../../components/form-new-business/form-new-business.module';
import { PoliciesTableModule } from 'src/app/portal/policies/components/policies-table/policies-table.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PolicyTypeSelectorModule } from '../../components/policy-type-selector/policy-type-selector.module';
import { EndorsementsSelectorModule } from '../../components/endorsements-selector/endorsements-selector.module';

const routes: Routes = [
  {
    path: '',
    component: NewRequestComponent,
  },
];

@NgModule({
  declarations: [NewRequestComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PagesLayoutModule,
    TypeSelectorModule,
    RequesTypeSelectorModule,
    FormRequestsFromPolicyModule,
    ReactiveFormsModule,
    FormNewBusinessModule,
    CDKModule,
    PoliciesTableModule,
    MatPaginatorModule,
    PolicyTypeSelectorModule,
    EndorsementsSelectorModule,
  ],
  exports: [NewRequestComponent],
})
export class NewRequestModule {}
