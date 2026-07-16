import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConvertLeadComponent } from './convert-lead.component';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { CDKModule } from 'src/core/cdk/cdk.module';
import { CustomPipesModule } from 'src/app/shared/pipes/custom-pipes.module';
import { TranslateModule } from '@ngx-translate/core';
import { DateInputModule } from 'src/app/shared/components/date-input/date-input.module';

const routes: Routes = [
  { path: '', component: ConvertLeadComponent },
];

@NgModule({
  declarations: [ConvertLeadComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    PagesLayoutModule,
    MatTooltipModule,
    CDKModule,
    CustomPipesModule,
    TranslateModule,
    DateInputModule,
  ],
})
export class ConvertLeadModule {}
