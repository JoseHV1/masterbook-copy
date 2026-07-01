import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule, TransferState } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientJsonpModule,
  HttpClientModule,
} from '@angular/common/http';

import { registerLocaleData } from '@angular/common';
import localeEn from '@angular/common/locales/en';
import localeEsCo from '@angular/common/locales/es-CO';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { LanguageService } from './shared/services/language.service';
import { translateBrowserLoaderFactory } from './shared/loaders/translate-loader.browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { LoaderModule } from './shared/components/loader/loader.module';
import { UiService } from './shared/services/ui.service';
import { AuthService } from './shared/services/auth.service';
import { AlertsModule } from './shared/components/alerts/alerts.module';
import { ErrorsHttpInterceptor } from './shared/interceptors/errors-http.interceptor';
import { AuthHttpInterceptor } from './shared/interceptors/auth-http.interceptor';
import { ModalsModule } from './shared/components/modals/modals.module';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { NgxStripeModule } from 'ngx-stripe';
import { environment } from 'src/environments/environment';
import { ModalChangeLogsModule } from './shared/components/modal-change-logs/modal-change-logs.module';

import { NgxEchartsModule } from 'ngx-echarts';

registerLocaleData(localeEn, 'en-US');
registerLocaleData(localeEsCo, 'es-CO');

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,

    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),

    LoaderModule,
    ModalsModule,
    MatDialogModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientJsonpModule,
    AlertsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    ModalChangeLogsModule,

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateBrowserLoaderFactory,
        deps: [HttpClient, TransferState],
      },
    }),

    NgxStripeModule.forRoot(environment.STRIPE_PUBLIC_KEY),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    LanguageService,
    UiService,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorsHttpInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
