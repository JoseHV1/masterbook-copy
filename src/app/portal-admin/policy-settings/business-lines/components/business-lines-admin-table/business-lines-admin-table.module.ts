import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessLinesAdminTableComponent } from './business-lines-admin-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FiltersModule } from 'src/app/shared/components/filters/filters.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { CustomPipesModule } from 'src/app/shared/pipes/custom-pipes.module';

@NgModule({
  declarations: [BusinessLinesAdminTableComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MatTableModule,
    MatTooltipModule,
    FiltersModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    CustomPipesModule,
  ],
  exports: [BusinessLinesAdminTableComponent],
})
export class BusinessLinesAdminTableModule {}
