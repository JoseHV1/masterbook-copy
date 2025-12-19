import moment from 'moment';

export class InputUtils {
  static onlyAllowNumbers(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
    }
  }

  static formatToYMD(dateString: string) {
    return moment(dateString).format('YYYY-MM-DD');
  }
}
