import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatListModule } from '@angular/material/list';

import { ReportConfigComponent } from '../reports/components/create-report/create-report.component';
import { ReportPreviewComponent } from './components/preview-report/preview-report.component';
import { ReportHistoryComponent } from './components/download-center/download-center.component';
import { ReportsComponent } from './reports.component';
import { RouterModule, Routes } from '@angular/router';
import { InternalLayoutModule } from '@app/shared/layouts/internal-layout/internal-layout.module';
import { PagesLayoutModule } from '@app/shared/layouts/pages-layout/pages-layout.module';
import { CDKModule } from 'src/core/cdk/cdk.module';

const routes: Routes = [{ path: '', component: ReportsComponent }];

@NgModule({
  declarations: [
    ReportConfigComponent,
    ReportPreviewComponent,
    ReportHistoryComponent,
    ReportsComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonToggleModule,
    MatListModule,
    RouterModule.forChild(routes),
    PagesLayoutModule,
    CDKModule,
  ],
  exports: [ReportsComponent],
})
export class ReportsModule {}
