import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    CommonModule,
    RouterModule.forChild(routes),
    PagesLayoutModule,
    CustomPipesModule,
  ],
  exports: [CommissionDetailsComponent],
})
export class CommissionDetailsModule {}
