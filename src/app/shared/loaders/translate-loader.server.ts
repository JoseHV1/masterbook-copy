import {
  StateKey,
  TransferState,
  makeStateKey,
} from '@angular/platform-browser';
import { TranslateLoader } from '@ngx-translate/core';
import { join } from 'path';
import { Observable } from 'rxjs';
import * as fs from 'fs';

export class TranslateLoaderServer implements TranslateLoader {
  constructor(
    private transferState: TransferState,
    private prefix: string = 'i18n',
    private suffix: string = '.json'
  ) {}

  public getTranslation(lang: string): Observable<any> {
    return new Observable(observer => {
      const assets_folder = join(
        process.cwd(),
        'dist',
        'mymasterbook-portal',
        'browser',
        'assets',
        this.prefix
      );
      `${assets_folder}/${lang}${this.suffix}`;
      const langComplete = lang + this.suffix;
      const jsonData = JSON.parse(
        fs.readFileSync(join(assets_folder, langComplete), 'utf8')
      );

      const key: StateKey<number> = makeStateKey<number>(
        'transfer-translate-' + lang
      );
      this.transferState.set(key, jsonData);

      observer.next(jsonData);
      observer.complete();
    });
  }
}

export function translateServerLoaderFactory(transferState: TransferState) {
  return new TranslateLoaderServer(transferState);
}
