import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountFormModalComponent } from './account-form-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CDKModule } from 'src/core/cdk/cdk.module';
import { FiltersModule } from '@app/shared/components/filters/filters.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FilteredTableHeaderModule } from '@app/shared/components/filters/filtered-table-header/filtered-table-header.module';
import { MatInputModule } from '@angular/material/input';
import { CustomPipesModule } from '@app/shared/pipes/custom-pipes.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [AccountFormModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CDKModule,
    MatButtonModule,
    FiltersModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    FilteredTableHeaderModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatSidenavModule,
    CustomPipesModule,
    MatCheckboxModule,
  ],
  exports: [AccountFormModalComponent],
})
export class AccountFormModalModule {}
