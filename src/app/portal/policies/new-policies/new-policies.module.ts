import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewPoliciesComponent } from './new-policies.component';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { RouterModule, Routes } from '@angular/router';
import { PolicyFormModule } from '../components/policy-form/policy-form.module';
import { PolicyAccountSelectorModule } from '../components/policy-account-selector/policy-account-selector.module';
import { MassiveImportLayoutModule } from 'src/app/shared/layouts/massive-import-layout/massive-import-layout.module';
import { PolicyTypeSelectorModule } from '@app/portal/requests/components/policy-type-selector/policy-type-selector.module';
import { EndorsementsSelectorModule } from '@app/portal/requests/components/endorsements-selector/endorsements-selector.module';

const routes: Routes = [
  {
    path: '',
    component: NewPoliciesComponent,
  },
];

@NgModule({
  declarations: [NewPoliciesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PagesLayoutModule,
    PolicyFormModule,
    PolicyAccountSelectorModule,
    MassiveImportLayoutModule,
    PolicyTypeSelectorModule,
    EndorsementsSelectorModule,
  ],
  exports: [NewPoliciesComponent],
})
export class NewPoliciesModule {}
