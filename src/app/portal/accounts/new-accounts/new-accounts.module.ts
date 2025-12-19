import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewAccountsComponent } from './new-accounts.component';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { RouterModule, Routes } from '@angular/router';
import { FormAccountsModule } from '../components/form-accounts/form-accounts.module';
import { MassiveImportLayoutModule } from 'src/app/shared/layouts/massive-import-layout/massive-import-layout.module';

const routes: Routes = [
  {
    path: '',
    component: NewAccountsComponent,
  },
];

@NgModule({
  declarations: [NewAccountsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PagesLayoutModule,
    FormAccountsModule,
    MassiveImportLayoutModule,
  ],
  exports: [NewAccountsComponent],
})
export class NewAccountsModule {}
