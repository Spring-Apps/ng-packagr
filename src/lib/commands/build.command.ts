import { Command } from './command';
import { ngPackagr } from '../ng-v5/packagr';

/** CLI arguments passed to `ng-packagr` executable and `build()` command. */
export interface CliArguments {
  /** Path to the project file 'package.json', 'ng-package.json', or 'ng-package.js'. */
  project: string;
}

/** @stable */
<<<<<<< HEAD
export const build: Command<CliArguments, void> = opts =>
  ngPackagr()
=======
export const build: Command<CliArguments, void> =
  (opts) => ngPackagr()
>>>>>>> feat: le jardin, a broccoli-inspired rewrite
    .forProject(opts.project)
    .build();
