import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewHowToComponent } from './new-how-to.component';
import { RouterModule, Routes } from '@angular/router';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { FormNewHowToModule } from '../../components/form-new-how-to/form-new-how-to.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';

const routes: Routes = [
  {
    path: '',
    component: NewHowToComponent,
  },
];

@NgModule({
  declarations: [NewHowToComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PagesLayoutModule,
    FormNewHowToModule,
    TranslateModule,
    MatTooltipModule,
  ],
  exports: [NewHowToComponent],
})
export class NewHowToModule {}
