import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
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
  imports: [CommonModule, TranslateModule, RouterModule.forChild(routes), PagesLayoutModule],
})
export class ClaimsModule {}
