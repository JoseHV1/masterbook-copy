import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersTableComponent } from './users-table.component';
import { MatTableModule } from '@angular/material/table';
import { CustomPipesModule } from 'src/app/shared/pipes/custom-pipes.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FiltersModule } from 'src/app/shared/components/filters/filters.module';

@NgModule({
  declarations: [UsersTableComponent],
  imports: [
    CommonModule,
    MatTableModule,
    CustomPipesModule,
    MatTooltipModule,
    MatSlideToggleModule,
    FiltersModule,
  ],
  exports: [UsersTableComponent],
})
export class UsersTableModule {}
