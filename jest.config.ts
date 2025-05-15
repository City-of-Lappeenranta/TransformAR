import type { Config } from 'jest';
const { pathsToModuleNameMapper } = require('ts-jest');
const { paths } = require('./tsconfig.json').compilerOptions;
import { createCjsPreset } from 'jest-preset-angular/presets';

/** @type {import("ts-jest/dist/types").InitialOptionsTsJest} */
export default {
  ...createCjsPreset(),
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(paths, { prefix: '<rootDir>' }),
    '^lodash-es$': 'lodash',
  },
  moduleFileExtensions: ['ts', 'js'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/cypress/',
    '<rootDir>/e2e/',
  ],
  coverageDirectory: '<rootDir>/reports',
  coverageReporters: [
    'html',
    [
      'lcovonly',
      {
        file: 'lcov-coverage-report.info',
      },
    ],
  ],
  modulePaths: ['<rootDir>/src'],
  reporters: [
    'jest-mocha-spec-reporter',
    [
      'jest-junit',
      {
        allowEmptyResults: true,
        outputDirectory: 'reports',
        outputName: 'jest-report.xml',
      },
    ],
  ],
  testResultsProcessor: 'jest-sonar-reporter',
} satisfies Config;
