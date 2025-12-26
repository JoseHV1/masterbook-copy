import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoicesTableComponent } from './invoices-table.component';
import { MatTableModule } from '@angular/material/table';
import { CustomPipesModule } from 'src/app/shared/pipes/custom-pipes.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FiltersModule } from 'src/app/shared/components/filters/filters.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
  declarations: [InvoicesTableComponent],
  imports: [
    CommonModule,
    MatTableModule,
    CustomPipesModule,
    MatTooltipModule,
    MatSlideToggleModule,
    FiltersModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatChipsModule,
  ],
  exports: [InvoicesTableComponent],
})
export class InvoicesTableModule {}
