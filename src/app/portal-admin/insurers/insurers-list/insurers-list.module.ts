import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { InsurersListComponent } from './insurers-list.component';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { FilteredTableHeaderModule } from 'src/app/shared/components/filters/filtered-table-header/filtered-table-header.module';
import { FiltersModule } from 'src/app/shared/components/filters/filters.module';
import { InsurersAdminTableModule } from '../components/insurers-admin-table/insurers-admin-table.module';
import { CDKModule } from 'src/core/cdk/cdk.module';

const routes: Routes = [{ path: '', component: InsurersListComponent }];

@NgModule({
  declarations: [InsurersListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterModule.forChild(routes),
    CDKModule,
    PagesLayoutModule,
    FilteredTableHeaderModule,
    FiltersModule,
    InsurersAdminTableModule,
    MatPaginatorModule,
    MatSidenavModule,
  ],
})
export class InsurersListModule {}
