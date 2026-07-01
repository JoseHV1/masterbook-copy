import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { UiService } from '../../services/ui.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-input-file',
  templateUrl: './input-file.component.html',
  styleUrls: ['./input-file.component.scss'],
})
export class InputFileComponent {
  @ViewChild('inputFile') inputFile!: ElementRef;
  @Input() label!: string;
  @Input() placeholder!: string;
  @Input() maxMbAllowed: number = 10;
  @Input() styleError: boolean = false;
  @Input() fileData?: string;
  @Output() resultFile: EventEmitter<string> = new EventEmitter<string>();

  value!: string;
  allowedTypes: string[] = ['pdf', 'application/pdf'];

  constructor(private _ui: UiService, private _t: TranslateService) {}

  openNavigatorFile() {
    this.inputFile.nativeElement.click();
  }

  addFile(event: any) {
    const reader = new FileReader();
    const file = event.target.files[0] ?? null;
    if (!file) return;

    if (file?.size / 1048576 > this.maxMbAllowed) {
      this._ui.showAlertError(this._t.instant('SHARED.FILE.MAX_SIZE_ERROR', { mb: this.maxMbAllowed }));
      return;
    }

    if (!this.allowedTypes.includes(file?.type)) {
      this._ui.showAlertError(this._t.instant('SHARED.FILE.TYPE_NOT_ALLOWED'));
      return;
    }

    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const result = reader.result as string;
      this.placeholder = file.name;
      let baseString = result.split(',').slice(1).join(',');
      this.resultFile.emit(baseString);
    };
  }
}
