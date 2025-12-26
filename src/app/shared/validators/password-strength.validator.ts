import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class PasswordStrengthValidator {
  static strongPassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value || '';

      if (!value) {
        return {
          MIN_LENGTH: true,
          UPPERCASE: true,
          NUMBER: true,
          SPECIAL_CHAR: true,
        };
      }

      const errors: ValidationErrors = {};

      if (value.length < 8) {
        errors['MIN_LENGTH'] = true;
      }
      if (!/[A-Z]/.test(value)) {
        errors['UPPERCASE'] = true;
      }
      if (!/\d/.test(value)) {
        errors['NUMBER'] = true;
      }
      if (!/[@$!%*?&._-]/.test(value)) {
        errors['SPECIAL_CHAR'] = true;
      }

      return Object.keys(errors).length ? errors : null;
    };
  }
}
