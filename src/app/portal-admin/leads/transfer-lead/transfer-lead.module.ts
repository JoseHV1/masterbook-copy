import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TransferLeadComponent } from './transfer-lead.component';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { FiltersModule } from 'src/app/shared/components/filters/filters.module';

const routes: Routes = [
  { path: '', component: TransferLeadComponent },
];

@NgModule({
  declarations: [TransferLeadComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PagesLayoutModule,
    MatTableModule,
    MatTooltipModule,
    FiltersModule,
  ],
})
export class TransferLeadModule {}
