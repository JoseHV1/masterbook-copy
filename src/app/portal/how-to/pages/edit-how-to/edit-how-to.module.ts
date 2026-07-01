import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditHowToComponent } from './edit-how-to.component';
import { RouterModule, Routes } from '@angular/router';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { FormNewHowToModule } from '../../components/form-new-how-to/form-new-how-to.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';

const routes: Routes = [
  {
    path: '',
    component: EditHowToComponent,
  },
];

@NgModule({
  declarations: [EditHowToComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PagesLayoutModule,
    FormNewHowToModule,
    TranslateModule,
    MatTooltipModule,
  ],
  exports: [EditHowToComponent],
})
export class EditHowToModule {}
