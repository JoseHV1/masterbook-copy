import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormRequestsFromPolicyComponent } from './form-requests-from-policy.component';
import { CustomPipesModule } from 'src/app/shared/pipes/custom-pipes.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { CDKModule } from 'src/core/cdk/cdk.module';
import { TranslateModule } from '@ngx-translate/core';
import { CurrencyInputModule } from 'src/app/shared/components/currency-input/currency-input.module';

@NgModule({
  declarations: [FormRequestsFromPolicyComponent],
  imports: [
    CommonModule,
    CustomPipesModule,
    ReactiveFormsModule,
    TranslateModule,
    ButtonModule,
    MatExpansionModule,
    CDKModule,
    CurrencyInputModule,
  ],
  exports: [FormRequestsFromPolicyComponent],
})
export class FormRequestsFromPolicyModule {}
