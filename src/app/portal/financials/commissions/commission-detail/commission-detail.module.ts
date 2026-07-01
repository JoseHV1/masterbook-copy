import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommissionDetailsComponent } from './commission-detail.component';
import { RouterModule, Routes } from '@angular/router';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { CustomPipesModule } from 'src/app/shared/pipes/custom-pipes.module';

const routes: Routes = [
  {
    path: '',
    component: CommissionDetailsComponent,
  },
];

@NgModule({
  declarations: [CommissionDetailsComponent],
  imports: [
    TranslateModule,
    CommonModule,
    RouterModule.forChild(routes),
    PagesLayoutModule,
    CustomPipesModule,
    MatTooltipModule,
  ],
  exports: [CommissionDetailsComponent],
})
export class CommissionDetailsModule {}
