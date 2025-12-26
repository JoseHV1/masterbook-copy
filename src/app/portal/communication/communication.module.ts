import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./email-list/email-list.module').then(
        module => module.EmailListModule
      ),
  },
  {
    path: 'send',
    loadChildren: () =>
      import('./send-email/send-email.module').then(
        module => module.SendEmailModule
      ),
  },
  {
    path: 'detail/:id',
    loadChildren: () =>
      import('./email-detail/email-detail.module').then(
        module => module.EmailDetailModule
      ),
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class CommunicationModule {}
