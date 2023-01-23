import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
  console.log = () => { };
  console.warn = () => { };
  console.error = () => { };
  console.info = () => { };
  console.debug = () => { };
  console.trace = () => { };
  console.clear = () => { };
  console.time = () => { };
}

platformBrowserDynamic().bootstrapModule(AppModule).catch(err => console.error(err));
