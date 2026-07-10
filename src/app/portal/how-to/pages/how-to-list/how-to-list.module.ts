import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { HowToListComponent } from './how-to-list.component';
import { HowToTenantSectionComponent } from './how-to-tenant-section.component';
import { RouterModule, Routes } from '@angular/router';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FilteredTableHeaderModule } from 'src/app/shared/components/filters/filtered-table-header/filtered-table-header.module';
import { FiltersModule } from 'src/app/shared/components/filters/filters.module';
import { HowToTableModule } from '../../components/how-to-table/how-to-table.module';

const routes: Routes = [
  {
    path: '',
    component: HowToListComponent,
  },
];

@NgModule({
  declarations: [HowToListComponent, HowToTenantSectionComponent],
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule.forChild(routes),
    PagesLayoutModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatSidenavModule,
    FilteredTableHeaderModule,
    FiltersModule,
    HowToTableModule,
  ],
  exports: [HowToListComponent],
})
export class HowToListModule {}
