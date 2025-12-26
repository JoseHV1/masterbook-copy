import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { PaymentsListComponent } from './payments-list.component';
import { CustomPipesModule } from 'src/app/shared/pipes/custom-pipes.module';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [PaymentsListComponent],
  imports: [
    CommonModule,
    PagesLayoutModule,
    CustomPipesModule,
    MatTableModule,
    MatTooltipModule,
  ],
  exports: [PaymentsListComponent],
})
export class PaymentsListModule {}
