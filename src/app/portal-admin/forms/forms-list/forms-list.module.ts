import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AdminFormsListComponent } from './forms-list.component';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { FilteredTableHeaderModule } from 'src/app/shared/components/filters/filtered-table-header/filtered-table-header.module';
import { FiltersModule } from 'src/app/shared/components/filters/filters.module';
import { CustomPipesModule } from 'src/app/shared/pipes/custom-pipes.module';
import { CreateFormModalModule } from 'src/app/portal/forms/components/create-form-modal/create-form-modal.module';
import { MatDialogModule } from '@angular/material/dialog';

const routes: Routes = [{ path: '', component: AdminFormsListComponent }];

@NgModule({
  declarations: [AdminFormsListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    MatTableModule,
    MatPaginatorModule,
    MatSidenavModule,
    MatTooltipModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    PagesLayoutModule,
    FilteredTableHeaderModule,
    FiltersModule,
    CustomPipesModule,
    CreateFormModalModule,
  ],
})
export class AdminFormsListModule {}
