import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClaimsComponent } from './claims.component';
import { RouterModule, Routes } from '@angular/router';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';

const routes: Routes = [
  {
    path: '',
    component: ClaimsComponent,
  },
];

@NgModule({
  declarations: [ClaimsComponent],
  imports: [CommonModule, RouterModule.forChild(routes), PagesLayoutModule],
})
export class ClaimsModule {}
