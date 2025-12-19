import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditAccountsComponent } from './edit-accounts.component';
import { RouterModule, Routes } from '@angular/router';
import { FormAccountsModule } from '../components/form-accounts/form-accounts.module';
import { PagesLayoutModule } from '../../../shared/layouts/pages-layout/pages-layout.module';
import { MatTooltipModule } from '@angular/material/tooltip';

const routes: Routes = [
  {
    path: '',
    component: EditAccountsComponent,
  },
];

@NgModule({
  declarations: [EditAccountsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormAccountsModule,
    PagesLayoutModule,
    MatTooltipModule,
  ],
  exports: [EditAccountsComponent],
})
export class EditAccountsModule {}
