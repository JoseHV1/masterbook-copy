import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { InvitePolicyHolderComponent } from './invite-policy-holder.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';

const routes: Routes = [
  {
    path: '',
    component: InvitePolicyHolderComponent,
  },
];

@NgModule({
  declarations: [InvitePolicyHolderComponent],
  imports: [
    RouterModule.forChild(routes),
    HttpClientModule,
    FormsModule,
    PagesLayoutModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  exports: [InvitePolicyHolderComponent],
})
export class InvitePolicyHolderModule {}
