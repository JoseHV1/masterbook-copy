import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RequestsTableComponent } from './requests-table.component';
import { MatTableModule } from '@angular/material/table';
import { CustomPipesModule } from 'src/app/shared/pipes/custom-pipes.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FiltersModule } from 'src/app/shared/components/filters/filters.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [RequestsTableComponent],
  imports: [
    TranslateModule,
    CommonModule,
    MatTableModule,
    CustomPipesModule,
    MatTooltipModule,
    MatSlideToggleModule,
    FiltersModule,
    MatMenuModule,
    MatIconModule,
  ],
  exports: [RequestsTableComponent],
})
export class RequestsTableModule {}
