import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import './app/shared/leaflet/leaflet-default-icon';

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
