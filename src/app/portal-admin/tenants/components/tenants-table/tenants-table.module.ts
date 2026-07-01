import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TenantsTableComponent } from './tenants-table.component';
import { CustomPipesModule } from 'src/app/shared/pipes/custom-pipes.module';
import { FiltersModule } from 'src/app/shared/components/filters/filters.module';

@NgModule({
  declarations: [TenantsTableComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MatTableModule,
    MatTooltipModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    CustomPipesModule,
    FiltersModule,
  ],
  exports: [TenantsTableComponent],
})
export class TenantsTableModule {}
