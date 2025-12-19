import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PolicyAccountSelectorComponent } from './policy-account-selector.component';
import { FormsModule } from '@angular/forms';
import { CDKModule } from 'src/core/cdk/cdk.module';
import { DirectivesModule } from 'src/app/shared/helpers/directives/directives.module';
import { CustomPipesModule } from 'src/app/shared/pipes/custom-pipes.module';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  declarations: [PolicyAccountSelectorComponent],
  imports: [
    CommonModule,
    CDKModule,
    DirectivesModule,
    CustomPipesModule,
    MatExpansionModule,
    FormsModule,
  ],
  exports: [PolicyAccountSelectorComponent],
})
export class PolicyAccountSelectorModule {}
