import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MyBrokerComponent } from './my-broker.component';
import { RouterModule, Routes } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { CustomPipesModule } from '@app/shared/pipes/custom-pipes.module';

const routes: Routes = [
  {
    path: '',
    component: MyBrokerComponent,
  },
];

@NgModule({
  declarations: [MyBrokerComponent],
  imports: [
    TranslateModule,
    CommonModule,
    RouterModule.forChild(routes),
    MatTooltipModule,
    PagesLayoutModule,
    CustomPipesModule,
  ],
})
export class MyBrokerModule {}
