import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormComponent } from './form.component';
import { RouterModule, Routes } from '@angular/router';
import { OwnerGuard } from '../../shared/guards/owner.guard';
import { PaymentGuard } from 'src/app/shared/guards/payment.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./forms-grid/forms-grid.module').then(
        module => module.FormsGridModule
      ),
  },
];

@NgModule({
  declarations: [FormComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [FormComponent],
})
export class FormsModule {}
