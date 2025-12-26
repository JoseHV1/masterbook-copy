import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyBrokerComponent } from './my-broker.component';
import { RouterModule, Routes } from '@angular/router';
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
    CommonModule,
    RouterModule.forChild(routes),
    PagesLayoutModule,
    CustomPipesModule,
  ],
})
export class MyBrokerModule {}
