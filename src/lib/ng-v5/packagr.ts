import { ParsedConfiguration } from '@angular/compiler-cli';
import { InjectionToken, Provider, ReflectiveInjector, ValueProvider } from 'injection-js';
import { BUILD_NG_PACKAGE_TOKEN, BUILD_NG_PACKAGE_PROVIDER, BuildCallSignature } from '../steps/build-ng-package';
import {
  defaultTsConfigFactory,
  TsConfig,
  DEFAULT_TS_CONFIG_PROVIDER,
  DEFAULT_TS_CONFIG_TOKEN
} from '../ts/default-tsconfig';
import { INIT_TS_CONFIG_PROVIDER } from '../ts/init-tsconfig';
import { ENTRY_POINT_TRANSFORMS_PROVIDER } from '../steps/entry-point-transforms';

export class NgPackagr {
  constructor(private providers: Provider[]) {}

  public forProject(project: string): NgPackagr {
    this.providers.push(provideProject(project));

    return this;
  }

  public withProviders(providers: Provider[]): NgPackagr {
    this.providers = [...this.providers, ...providers];

    return this;
  }

  /** Overwrites the default TypeScript configuration. */
  public withTsConfig(defaultValues: TsConfig | string): NgPackagr {
    this.providers.push(provideTsConfig(defaultValues));

    return this;
  }

  public build(): Promise<void> {
    const injector = ReflectiveInjector.resolveAndCreate(this.providers);
    const project = injector.get(PROJECT_TOKEN);

    const buildNgPackage: BuildCallSignature = injector.get(BUILD_NG_PACKAGE_TOKEN);

    return buildNgPackage({ project });
  }
}

export const ngPackagr = (): NgPackagr =>
  new NgPackagr([
    // Add default providers to this list.
    BUILD_NG_PACKAGE_PROVIDER,
    ENTRY_POINT_TRANSFORMS_PROVIDER,
    DEFAULT_TS_CONFIG_PROVIDER,
    INIT_TS_CONFIG_PROVIDER
  ]);

export const PROJECT_TOKEN = new InjectionToken<string>('ng.v5.project');

export const provideProject = (project: string): ValueProvider => ({
  provide: PROJECT_TOKEN,
  useValue: project
});

export const provideTsConfig = (values: TsConfig | string): ValueProvider => {
  const tsConfig: TsConfig = typeof values === 'string' ? defaultTsConfigFactory(values) : values;

  return {
    provide: DEFAULT_TS_CONFIG_TOKEN,
    useValue: tsConfig
  };
};
