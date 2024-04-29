import { HttpClient } from '@angular/common/http';
import { EnvironmentProviders, importProvidersFrom } from '@angular/core';
import { TranslateLoader, TranslateModule, TranslateModuleConfig } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

const config: TranslateModuleConfig = {
  defaultLanguage: 'en',
  useDefaultLang: true,
  loader: {
    provide: TranslateLoader,
    useFactory: (httpClient: HttpClient) => new TranslateHttpLoader(httpClient),
    deps: [HttpClient],
  },
};

export function providei18n(): EnvironmentProviders {
  return importProvidersFrom([TranslateModule.forRoot(config)]);
}
