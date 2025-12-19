import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivacyPolicyComponent } from './privacy-policy.component';
import { RouterModule, Routes } from '@angular/router';
import { PrivacyPolicyCoreModule } from './privacy-policy-core/privacy-policy-core.module';

const routes: Routes = [
  {
    path: '',
    component: PrivacyPolicyComponent,
  },
];

@NgModule({
  declarations: [PrivacyPolicyComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PrivacyPolicyCoreModule,
  ],
})
export class PrivacyPolicyModule {}
