import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AgencyLeadComponent } from './agency-lead.component';
import { FormAgencyLeadModule } from './components/form-agency-lead/form-agency-lead.module';

const routes: Routes = [
  {
    path: ':token/:social',
    component: AgencyLeadComponent,
  },
];

@NgModule({
  declarations: [AgencyLeadComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormAgencyLeadModule,
  ],
})
export class AgencyLeadModule {}
