import { AppComponent } from './app/app.component';
import { importProvidersFrom, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';

import { inject } from '@angular/core';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    importProvidersFrom(BrowserModule),
  ]
}).then(() => {
  const injector = inject(Injector);
  const element = createCustomElement(AppComponent, { injector });
  customElements.define('mi-componente-angular', element);
}).catch(err => console.error(err));
