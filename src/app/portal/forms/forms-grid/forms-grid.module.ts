import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FiltersModule } from 'src/app/shared/components/filters/filters.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FilteredTableHeaderModule } from 'src/app/shared/components/filters/filtered-table-header/filtered-table-header.module';
import { FormGridComponent } from './forms-grid.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModalModule } from '../components/forms-modal/forms-modal.module';
import { CreateFormModalModule } from '../components/create-form-modal/create-form-modal.module';
import { CDKModule } from 'src/core/cdk/cdk.module';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: FormGridComponent,
  },
];

@NgModule({
  declarations: [FormGridComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PagesLayoutModule,
    FilteredTableHeaderModule,
    MatPaginatorModule,
    FiltersModule,
    MatSidenavModule,
    MatExpansionModule,
    FormsModalModule,
    CreateFormModalModule,
    CDKModule,
    ReactiveFormsModule,
  ],
  exports: [FormGridComponent],
})
export class FormsGridModule {}
