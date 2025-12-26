import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SendEmailComponent } from './send-email.component';
import { RouterModule, Routes } from '@angular/router';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimaryButtonModule } from 'src/app/shared/components/primary-button/primary-button.module';
import { CDKModule } from 'src/core/cdk/cdk.module';

const routes: Routes = [
  {
    path: '',
    component: SendEmailComponent,
  },
];

@NgModule({
  declarations: [SendEmailComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PagesLayoutModule,
    MatSidenavModule,
    FormsModule,
    ReactiveFormsModule,
    PrimaryButtonModule,
    CDKModule,
  ],
})
export class SendEmailModule {}
