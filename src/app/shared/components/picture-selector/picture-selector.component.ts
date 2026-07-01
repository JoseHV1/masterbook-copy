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
  selector: 'app-picture-selector',
  templateUrl: './picture-selector.component.html',
  styleUrls: ['./picture-selector.component.scss'],
})
export class PictureSelectorComponent {
  @ViewChild('inputFile') inputFile!: ElementRef;
  @ViewChild('imgPicture') imgPicture!: ElementRef;
  @Input() icon?: string; //recibe una ruta de los assets con el icono
  @Input() background?: string = 'back-gray-200'; //recibe una clase con el background
  @Input() maxMbAllowed: number = 10;
  @Input() showSelector: boolean = true;
  @Output() imgChange: EventEmitter<string> = new EventEmitter<string>();

  value!: string;
  allowedTypes: string[] = [
    'png',
    'jpg',
    'jpeg',
    'image/png',
    'image/jpg',
    'image/jpeg',
  ];

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
      this.icon = result;
      this.imgChange.emit(result);
    };
  }
}
