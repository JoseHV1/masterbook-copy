import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailVerifyComponent } from './email-verify.component';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: EmailVerifyComponent,
  },
];

@NgModule({
  declarations: [EmailVerifyComponent],
  imports: [CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class EmailVerifyModule {}
