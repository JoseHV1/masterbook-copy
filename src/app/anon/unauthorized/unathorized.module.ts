import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { UnauthorizedComponent } from './unathorized.component';

const routes: Routes = [
  {
    path: '',
    component: UnauthorizedComponent,
  },
];

@NgModule({
  declarations: [UnauthorizedComponent],
  imports: [CommonModule, RouterModule.forChild(routes), TranslateModule],
})
export class UnauthorizedModule {}
