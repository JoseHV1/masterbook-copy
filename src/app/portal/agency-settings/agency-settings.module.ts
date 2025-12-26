import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgencySettingsComponent } from './agency-settings.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./agency-settings-details/agency-settings-details.module').then(
        module => module.AgencySettingsDetailsModule
      ),
  },
];

@NgModule({
  declarations: [AgencySettingsComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [AgencySettingsComponent],
})
export class AgencySettingsModule {}
