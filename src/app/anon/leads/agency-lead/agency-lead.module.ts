import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AgencyLeadComponent } from './agency-lead.component';
import { FormAgencyLeadModule } from './components/form-agency-lead/form-agency-lead.module';
import { TranslateModule } from '@ngx-translate/core';

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
    TranslateModule,
  ],
})
export class AgencyLeadModule {}
