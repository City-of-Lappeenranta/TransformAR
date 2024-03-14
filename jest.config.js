/* eslint-disable @typescript-eslint/naming-convention */

// eslint-disable-next-line no-undef
module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  moduleNameMapper: {
    '^@shared/(.*)$': '<rootDir>/app/shared/$1',
    '^@core/(.*)$': '<rootDir>/app/core/$1',
    '^@environments/(.*)$': '<rootDir>/environments/$1',
    '^lodash-es$': 'lodash',
  },
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
};
