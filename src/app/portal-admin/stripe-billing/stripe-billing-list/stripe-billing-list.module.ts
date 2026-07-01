import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { StripeBillingListComponent } from './stripe-billing-list.component';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { FilteredTableHeaderModule } from 'src/app/shared/components/filters/filtered-table-header/filtered-table-header.module';
import { FiltersModule } from 'src/app/shared/components/filters/filters.module';
import { StripeBillingTableModule } from '../components/stripe-billing-table/stripe-billing-table.module';

const routes: Routes = [{ path: '', component: StripeBillingListComponent }];

@NgModule({
  declarations: [StripeBillingListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    PagesLayoutModule,
    FilteredTableHeaderModule,
    FiltersModule,
    StripeBillingTableModule,
    MatPaginatorModule,
    MatSidenavModule,
  ],
})
export class StripeBillingListModule {}
