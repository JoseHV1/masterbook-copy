import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PolicyCategoriesAdminTableComponent } from './policy-categories-admin-table.component';
import { MatTableModule } from '@angular/material/table';
import { CustomPipesModule } from 'src/app/shared/pipes/custom-pipes.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FiltersModule } from 'src/app/shared/components/filters/filters.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [PolicyCategoriesAdminTableComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MatTableModule,
    CustomPipesModule,
    MatTooltipModule,
    FiltersModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
  ],
  exports: [PolicyCategoriesAdminTableComponent],
})
export class PolicyCategoriesAdminTableModule {}
