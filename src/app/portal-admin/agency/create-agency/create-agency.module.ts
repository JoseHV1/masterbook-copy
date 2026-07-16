import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { CreateAgencyComponent } from './create-agency.component';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { CDKModule } from 'src/core/cdk/cdk.module';
import { AddressAutocompleteGoogleModule } from 'src/app/shared/directives/addres-autocomplete-google/address-autocomplete-google.module';
import { DateInputModule } from 'src/app/shared/components/date-input/date-input.module';

const routes: Routes = [
  { path: '', component: CreateAgencyComponent },
];

@NgModule({
  declarations: [CreateAgencyComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterModule.forChild(routes),
    PagesLayoutModule,
    CDKModule,
    InputTextModule,
    DropdownModule,
    NgxMaskDirective,
    NgxMaskPipe,
    AddressAutocompleteGoogleModule,
    DateInputModule,
  ],
  providers: [provideNgxMask()],
})
export class CreateAgencyModule {}
