import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgencyComponent } from './agency.component';
import { RouterModule, Routes } from '@angular/router';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';

const routes: Routes = [
  {
    path: '',
    component: AgencyComponent,
  },
];

@NgModule({
  declarations: [AgencyComponent],
  imports: [CommonModule, RouterModule.forChild(routes), PagesLayoutModule],
  exports: [AgencyComponent],
})
export class AgencyModule {}
