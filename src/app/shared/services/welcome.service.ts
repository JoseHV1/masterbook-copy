import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MyMasterbookValidators } from '../helpers/mymasterbook-validator';

@Injectable({
  providedIn: 'root',
})
export class WelcomeService {
  createNewIndependentAgentForm(): FormGroup {
    return new FormGroup({
      profile_image: new FormControl(),
      logo: new FormControl(),

      check_brand_publication: new FormControl([]),
      accepted_terms_conditions: new FormControl(false, [
        Validators.requiredTrue,
      ]),
      business_lines_ids: new FormControl(null, [
        Validators.required,
        MyMasterbookValidators.validLength(1, 6),
      ]),
      license_number: new FormControl(null, [
        Validators.required,
        Validators.maxLength(25),
      ]),
      license_number_expires_on: new FormControl(null, [Validators.required]),
      phone_number: new FormControl(null, [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
      ]),
      address: new FormControl(null, [Validators.required]),
      additional_address: new FormControl(null, [Validators.maxLength(100)]),
      address_extra: new FormControl(null, [Validators.required]),
    });
  }

  createAgencyForm(): FormGroup {
    const form = this.createNewIndependentAgentForm();
    form.addControl(
      'name',
      new FormControl(null, [Validators.required, Validators.maxLength(50)])
    );
    // form.addControl(
    //   'agency-email', //este es duda aun de como se llamara
    //   new FormControl(null, [Validators.required, Validators.maxLength(50)])
    // );
    form.addControl(
      'position', //este es duda aun de como se llamara
      new FormControl(null, [Validators.required, Validators.maxLength(50)])
    );
    form.addControl('staff_size', new FormControl(null, [Validators.min(1)]));
    return form;
  }

  createNewInsuredForm(): FormGroup {
    return new FormGroup({
      first_name: new FormControl(null, [Validators.required]),
      last_name: new FormControl(null, [Validators.required]),
      profile_image: new FormControl(),
      accepted_terms_conditions: new FormControl(false, [
        Validators.requiredTrue,
      ]),
      gender: new FormControl(null, [Validators.required]),
      marital_status: new FormControl(null, [Validators.required]),
      phone_extension: new FormControl(null, [Validators.maxLength(4)]),
      phone_number: new FormControl(null, [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
      ]),
      address: new FormControl(null, [Validators.required]),
      address_extra: new FormControl(null, [Validators.required]),
      additional_address: new FormControl(null, [Validators.maxLength(100)]),
      zipcode: new FormControl(null, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(5),
      ]),
    });
  }

  createNewAgencyBrokerAdminForm(): FormGroup {
    return new FormGroup({
      profile_image: new FormControl(),
      accepted_terms_conditions: new FormControl(false, [
        Validators.requiredTrue,
      ]),
      license_number: new FormControl(null, [
        Validators.required,
        Validators.maxLength(25),
      ]),
      license_number_expires_on: new FormControl(null, [Validators.required]),
      phone_number: new FormControl(null, [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
      ]),
      address: new FormControl(null, [Validators.required]),
      additional_address: new FormControl(null, [Validators.maxLength(100)]),
      address_extra: new FormControl(null, [Validators.required]),
    });
  }
}
