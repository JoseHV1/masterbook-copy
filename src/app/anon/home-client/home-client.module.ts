import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeClientComponent } from './home-client.component';
import { RouterModule, Routes } from '@angular/router';
import { PrimaryButtonModule } from '../../shared/components/primary-button/primary-button.module';
import { PlanCardModule } from '../../shared/components/plan-card/plan-card.module';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: HomeClientComponent,
  },
];

@NgModule({
  declarations: [HomeClientComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PrimaryButtonModule,
    PlanCardModule,
    TranslateModule,
  ],
  exports: [HomeClientComponent],
})
export class HomeClientModule {}
