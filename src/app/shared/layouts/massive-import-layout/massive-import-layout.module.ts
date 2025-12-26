import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MassiveImportLayoutComponent } from './massive-import-layout.component';
import { TabUploadFileModule } from './tab-upload-file/tab-upload-file.module';
import { TabTableUploadFileModule } from './tab-table-upload-file/tab-table-upload-file.module';
import { FiltersModule } from '../../components/filters/filters.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FilteredTableHeaderModule } from '../../components/filters/filtered-table-header/filtered-table-header.module';
import { MatSidenavModule } from '@angular/material/sidenav';

@NgModule({
  declarations: [MassiveImportLayoutComponent],
  imports: [
    CommonModule,
    MatTabsModule,
    MatPaginatorModule,
    MatSidenavModule,
    FiltersModule,
    FilteredTableHeaderModule,
    TabUploadFileModule,
    TabTableUploadFileModule,
  ],
  exports: [MassiveImportLayoutComponent],
})
export class MassiveImportLayoutModule {}
