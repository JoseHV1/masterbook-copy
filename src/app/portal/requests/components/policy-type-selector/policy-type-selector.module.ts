import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FiltersModule } from 'src/app/shared/components/filters/filters.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FilteredTableHeaderModule } from 'src/app/shared/components/filters/filtered-table-header/filtered-table-header.module';
import { PolicyTypeSelectorComponent } from './policy-type-selector.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CDKModule } from 'src/core/cdk/cdk.module';

@NgModule({
  declarations: [PolicyTypeSelectorComponent],
  imports: [
    CommonModule,
    PagesLayoutModule,
    FilteredTableHeaderModule,
    MatPaginatorModule,
    FiltersModule,
    MatSidenavModule,
    MatExpansionModule,
    FormsModule,
    CDKModule,
    ReactiveFormsModule,
  ],
  exports: [PolicyTypeSelectorComponent],
})
export class PolicyTypeSelectorModule {}
