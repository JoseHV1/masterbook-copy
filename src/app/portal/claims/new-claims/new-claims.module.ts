import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewClaimComponent } from './new-claims.component';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { RouterModule, Routes } from '@angular/router';
import { FormClaimsModule } from '../components/form-claims/form-claims.module';
import { CDKModule } from 'src/core/cdk/cdk.module';

const routes: Routes = [
  {
    path: '',
    component: NewClaimComponent,
  },
];

@NgModule({
  declarations: [NewClaimComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PagesLayoutModule,
    FormClaimsModule,
    CDKModule,
  ],
  exports: [NewClaimComponent],
})
export class NewClaimModule {}
