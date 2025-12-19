import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FiltersModule } from 'src/app/shared/components/filters/filters.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FilteredTableHeaderModule } from 'src/app/shared/components/filters/filtered-table-header/filtered-table-header.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { EndorsementsSelectorComponent } from './endorsements-selector.component';
import { CDKModule } from 'src/core/cdk/cdk.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [EndorsementsSelectorComponent],
  imports: [
    CommonModule,
    PagesLayoutModule,
    FilteredTableHeaderModule,
    MatPaginatorModule,
    FiltersModule,
    MatSidenavModule,
    MatExpansionModule,
    CDKModule,
    ReactiveFormsModule,
  ],
  exports: [EndorsementsSelectorComponent],
})
export class EndorsementsSelectorModule {}
