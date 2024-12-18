// import type { Config } from 'jest'

// export default {
//   rootDir: __dirname,

//   collectCoverage: true,

//   // Use a custom environment to fix missing globals in jsdom.
//   testEnvironment: 'jest-fixed-jsdom',

//   // Provide a setup file to enable MSW.
//   setupFilesAfterEnv: ['./src/setupTests.ts'],

//   // (Optional) Add suppor for TypeScript in Jest.
//   transform: {
//     '^.+\\.tsx?$': ['@swc/jest', {
//       jsc: {
//         parser: {
//               syntax: 'typescript',
//               tsx: true,
//               dynamicImport: true
//             },
//         target: 'es2022',
//         transform: { react: { runtime: 'automatic' } }
//       }
//     }],
//   },

//   moduleNameMapper: {
//     '^@/(.*)$': '<rootDir>/src/$1',
//     '\\.(css|scss|sass)$': 'identity-obj-proxy',
//   },

//   projects: [
//       {
//           displayName: 'unit',
//           testMatch: ['<rootDir>/tests/unit/**/*.test.tsx'],
//       },
//       {
//           displayName: 'integration',
//           testMatch: ['<rootDir>/tests/integration/**/*.test.tsx'],
//       },
//   ],

//   transformIgnorePatterns: []

// } satisfies Config


/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  testEnvironment: 'jest-fixed-jsdom',
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    "^.+\\.svg$": "jest-transformer-svg",
  },
  // projects: [
  //     {
  //         displayName: 'unit',
  //         testMatch: ['<rootDir>/tests/unit/**/*.test.tsx'],
  //     },
  //     {
  //         displayName: 'integration',
  //         testMatch: ['<rootDir>/tests/integration/**/*.test.tsx'],
  //     },
  // ],
};