export default {
  roots: ['<rootDir>'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{ts,tsx}',
    '!<rootDir>/src/main/**/*',
    '!<rootDir>/src/presentation/router/**/*',
    '!<rootDir>/src/**/index.*',
    '!<rootDir>/src/**/*.d.ts',
  ],
  coverageDirectory: 'coverage',
  testEnvironment: 'jsdom',
  transform: {
    '.+\\.(ts|tsx)$': 'ts-jest'
  },
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
    '\\.sass$': 'identity-obj-proxy'
  }
}
