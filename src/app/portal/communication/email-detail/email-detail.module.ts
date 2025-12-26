import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailDetailComponent } from './email-detail.component';
import { RouterModule, Routes } from '@angular/router';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: EmailDetailComponent,
  },
];

@NgModule({
  declarations: [EmailDetailComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PagesLayoutModule,
    MatSidenavModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class EmailDetailModule {}
