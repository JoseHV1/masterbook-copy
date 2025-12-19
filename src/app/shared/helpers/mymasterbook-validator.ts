import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export class MyMasterbookValidators {
  static emailPattern =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  static alphanumericPattern = /^[a-zA-Z0-9]$/;

  static equals(compare: string) {
    return (control: AbstractControl) => {
      const value = control.value;
      if (value !== compare) {
        return { equals: true };
      }
      return null;
    };
  }

  static validLength(min: number, max: number) {
    return (control: AbstractControl) => {
      const value = control.value;
      if (value?.length && (value.length > max || value.length < min)) {
        return { validLength: true };
      }
      return null;
    };
  }

  static minLength(min: number = 8): ValidatorFn {
    return (control: AbstractControl) => {
      const value = control.value || '';
      return value.length < min ? { MIN_LENGTH: true } : null;
    };
  }

  static uppercase(): ValidatorFn {
    return (control: AbstractControl) => {
      const value = control.value || '';
      const hasUppercase = /[A-Z]/.test(value);
      return !hasUppercase ? { UPPERCASE: true } : null;
    };
  }

  static number(): ValidatorFn {
    return (control: AbstractControl) => {
      const value = control.value || '';
      const hasNumber = /\d/.test(value);
      return !hasNumber ? { NUMBER: true } : null;
    };
  }

  static specialChar(): ValidatorFn {
    return (control: AbstractControl) => {
      const value = control.value || '';
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>_\-\[\]\\]/.test(value);
      return !hasSpecial ? { SPECIAL_CHAR: true } : null;
    };
  }
}

export function matchValidator(
  matchingControlName: string,
  controlName: string
): ValidatorFn {
  return (control: AbstractControl<any, any>) => {
    const formGroup = control.parent as FormGroup;
    if (!formGroup) return null;

    const matchingControlValue = formGroup.get(matchingControlName)?.value;
    const controlValue = formGroup.get(controlName)?.value;

    if (controlValue != matchingControlValue) {
      formGroup.get(controlName)?.setErrors({ mismatch: true });
      formGroup.get(controlName)?.markAsTouched();
      return { mismatch: true };
    } else {
      formGroup.get(controlName)?.setErrors(null);
      return null;
    }
  };
}

export function requireIfFilled(
  matchingControlName: string,
  controlName: string
): ValidatorFn {
  return (control: AbstractControl<any, any>) => {
    const formGroup = control.parent as FormGroup;
    if (!formGroup) return null;

    formGroup.get(controlName)?.valueChanges.subscribe(controlValue => {
      const matchingControlValue = formGroup.get(matchingControlName)?.value;
      if (controlValue === '' && matchingControlValue !== '') {
        formGroup.get(controlName)?.setErrors({ required: true });
      } else {
        formGroup.get(controlName)?.setErrors(null);
      }
    });

    return null;
  };
}
