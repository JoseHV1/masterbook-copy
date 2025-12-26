import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoliciesListComponent } from './policies-list.component';
import { RouterModule, Routes } from '@angular/router';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { CustomPipesModule } from 'src/app/shared/pipes/custom-pipes.module';
import { FormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FiltersModule } from 'src/app/shared/components/filters/filters.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CDKModule } from 'src/core/cdk/cdk.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FilteredTableHeaderModule } from 'src/app/shared/components/filters/filtered-table-header/filtered-table-header.module';
import { PoliciesTableModule } from '../components/policies-table/policies-table.module';

const routes: Routes = [
  {
    path: '',
    component: PoliciesListComponent,
  },
];

@NgModule({
  declarations: [PoliciesListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PagesLayoutModule,
    CustomPipesModule,
    MatSidenavModule,
    FiltersModule,
    MatTableModule,
    MatPaginatorModule,
    CDKModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    FilteredTableHeaderModule,
    PoliciesTableModule,
  ],
  exports: [PoliciesListComponent],
})
export class PoliciesListModule {}
