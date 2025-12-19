import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CDKModule } from 'src/core/cdk/cdk.module';
import { FilterWrapperComponent } from './filter-wrapper/filter-wrapper.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DefaultEmptyStateComponent } from './default-empty-state/default-empty-state.component';
import { FilterEmptyStateComponent } from './filter-empty-state/filter-empty-state.component';

@NgModule({
  declarations: [
    FilterWrapperComponent,
    DefaultEmptyStateComponent,
    FilterEmptyStateComponent,
  ],
  imports: [
    CommonModule,
    CDKModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
  ],
  exports: [
    FilterWrapperComponent,
    DefaultEmptyStateComponent,
    FilterEmptyStateComponent,
  ],
})
export class FiltersModule {}
