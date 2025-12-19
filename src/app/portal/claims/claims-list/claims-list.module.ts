import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClaimsListComponent } from './claims-list.component';
import { RouterModule, Routes } from '@angular/router';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { CustomPipesModule } from 'src/app/shared/pipes/custom-pipes.module';
import { FormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FiltersModule } from 'src/app/shared/components/filters/filters.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CDKModule } from 'src/core/cdk/cdk.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FilteredTableHeaderModule } from 'src/app/shared/components/filters/filtered-table-header/filtered-table-header.module';
import { ClaimsTableModule } from '../components/claims-table/claims-table.module';

const routes: Routes = [
  {
    path: '',
    component: ClaimsListComponent,
  },
];

@NgModule({
  declarations: [ClaimsListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PagesLayoutModule,
    CustomPipesModule,
    FormsModule,
    MatSidenavModule,
    FiltersModule,
    MatTableModule,
    MatPaginatorModule,
    CDKModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    FilteredTableHeaderModule,
    ClaimsTableModule,
  ],
  exports: [ClaimsListComponent],
})
export class ClaimsListModule {}
