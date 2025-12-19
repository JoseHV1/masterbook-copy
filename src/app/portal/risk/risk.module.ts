import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RiskComponent } from './risk.component';
import { RouterModule, Routes } from '@angular/router';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';

const routes: Routes = [
  {
    path: '',
    component: RiskComponent,
  },
];

@NgModule({
  declarations: [RiskComponent],
  imports: [CommonModule, RouterModule.forChild(routes), PagesLayoutModule],
  exports: [RiskComponent],
})
export class RiskModule {}
