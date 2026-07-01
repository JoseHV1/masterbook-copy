import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NewInsurerComponent } from './new-insurer.component';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { InsurerFormModule } from '../components/insurer-form/insurer-form.module';

const routes: Routes = [{ path: '', component: NewInsurerComponent }];

@NgModule({
  declarations: [NewInsurerComponent],
  imports: [CommonModule, TranslateModule, RouterModule.forChild(routes), MatTooltipModule, PagesLayoutModule, InsurerFormModule],
})
export class NewInsurerModule {}
