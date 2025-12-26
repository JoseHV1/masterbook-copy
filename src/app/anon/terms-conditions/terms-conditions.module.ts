import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TermsConditionsComponent } from './terms-conditions.component';
import { RouterModule, Routes } from '@angular/router';
import { TermsConditionsCoreModule } from './terms-conditions-core/terms-conditions-core.module';

const routes: Routes = [
  {
    path: '',
    component: TermsConditionsComponent,
  },
];

@NgModule({
  declarations: [TermsConditionsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TermsConditionsCoreModule,
  ],
})
export class TermsConditionsModule {}
