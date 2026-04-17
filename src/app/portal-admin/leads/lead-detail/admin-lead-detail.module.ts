import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AdminLeadDetailComponent } from './admin-lead-detail.component';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { CustomPipesModule } from 'src/app/shared/pipes/custom-pipes.module';

const routes: Routes = [
  { path: '', component: AdminLeadDetailComponent },
];

@NgModule({
  declarations: [AdminLeadDetailComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PagesLayoutModule,
    MatTooltipModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    CustomPipesModule,
  ],
})
export class AdminLeadDetailModule {}
