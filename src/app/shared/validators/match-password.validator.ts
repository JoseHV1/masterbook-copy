import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function matchPasswords(
  password: string,
  confirmPassword: string
): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const passwordControl = group.get(password);
    const confirmControl = group.get(confirmPassword);

    if (!passwordControl || !confirmControl) {
      return null;
    }

    if (confirmControl.errors && !confirmControl.errors['PASSWORDSMISMATCH']) {
      return null;
    }

    if (passwordControl.value !== confirmControl.value) {
      confirmControl.setErrors({ PASSWORDSMISMATCH: true });
      return { PASSWORDSMISMATCH: true };
    } else {
      confirmControl.setErrors(null);
      return null;
    }
  };
}
