import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailListComponent } from './email-list.component';
import { RouterModule, Routes } from '@angular/router';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { EmailTableModule } from '../components/email-table/email-table.module';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GmailDateFormatPipe } from '../pipe/gmail-date-format.pipe';
import { NoMorePagePipe } from '../pipe/no-more-page.pipe';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

const routes: Routes = [
  {
    path: '',
    component: EmailListComponent,
  },
];

@NgModule({
  declarations: [EmailListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PagesLayoutModule,
    MatSidenavModule,
    EmailTableModule,
    MatButtonToggleModule,
    FormsModule,
    ReactiveFormsModule,
    GmailDateFormatPipe,
    NoMorePagePipe,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
})
export class EmailListModule {}
