import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { RouterModule, Routes } from '@angular/router';
import { AgencySettingsDetailsComponent } from './agency-settings-details.component';
import { AgencySettingsFormModule } from '../components/agency-settings-form/agency-settings-form.module';

const routes: Routes = [
  {
    path: '',
    component: AgencySettingsDetailsComponent,
  },
];

@NgModule({
  declarations: [AgencySettingsDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PagesLayoutModule,
    AgencySettingsFormModule,
  ],
  exports: [AgencySettingsDetailsComponent],
})
export class AgencySettingsDetailsModule {}
