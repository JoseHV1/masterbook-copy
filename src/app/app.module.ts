import { NgModule } from '@angular/core';
import { BrowserModule, TransferState } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { LanguageService } from './shared/services/language.service';
import { translateBrowserLoaderFactory } from './shared/loaders/translate-loader.browser';
import { ProductPort } from 'src/business-logic/product/port/product.port';
import { ProductBackendAdapter } from '../business-logic/product/backend-adapter/product-backend.adapter';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateBrowserLoaderFactory,
        deps: [HttpClient, TransferState],
      },
    }),
  ],
  providers: [
    LanguageService,
    { provide: ProductPort, useClass: ProductBackendAdapter },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
