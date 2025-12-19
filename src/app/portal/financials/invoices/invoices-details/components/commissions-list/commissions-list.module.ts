import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { CommissionsListComponent } from './commissions-list.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { CustomPipesModule } from 'src/app/shared/pipes/custom-pipes.module';

@NgModule({
  declarations: [CommissionsListComponent],
  imports: [
    CommonModule,
    PagesLayoutModule,
    CustomPipesModule,
    MatTableModule,
    MatTooltipModule,
  ],
  exports: [CommissionsListComponent],
})
export class CommissionsListModule {}
