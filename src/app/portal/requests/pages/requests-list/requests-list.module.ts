import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestsListComponent } from './requests-list.component';
import { RouterModule, Routes } from '@angular/router';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { FormsModule } from '@angular/forms';
import { FiltersModule } from 'src/app/shared/components/filters/filters.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CDKModule } from 'src/core/cdk/cdk.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CustomPipesModule } from 'src/app/shared/pipes/custom-pipes.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FilteredTableHeaderModule } from 'src/app/shared/components/filters/filtered-table-header/filtered-table-header.module';
import { RequestsTableModule } from '../../components/requests-table/requests-table.module';

const routes: Routes = [
  {
    path: '',
    component: RequestsListComponent,
  },
];

@NgModule({
  declarations: [RequestsListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PagesLayoutModule,
    FiltersModule,
    MatTableModule,
    MatPaginatorModule,
    CDKModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    CustomPipesModule,
    MatSidenavModule,
    FilteredTableHeaderModule,
    RequestsTableModule,
  ],
  exports: [RequestsListComponent],
})
export class RequestListModule {}
