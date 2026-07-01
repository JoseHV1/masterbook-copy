import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';
import { LeadDetailComponent } from './lead-detail.component';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CustomPipesModule } from 'src/app/shared/pipes/custom-pipes.module';

const routes: Routes = [
  {
    path: '',
    component: LeadDetailComponent,
  },
];

@NgModule({
  declarations: [LeadDetailComponent],
  imports: [
    TranslateModule,
    CommonModule,
    RouterModule.forChild(routes),
    PagesLayoutModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    CustomPipesModule,
  ],
})
export class LeadDetailModule {}
