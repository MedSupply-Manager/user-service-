export default {
    testEnvironment: 'node',
    transform: {},
    testMatch: ['**/Test/**/*.test.js'],
    collectCoverageFrom: ['src/**/*.js'],
    coveragePathIgnorePatterns: ['/node_modules/'],
    testTimeout: 60000,
    detectOpenHandles: true,
    forceExit: true,
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true,
    verbose: true,
    maxWorkers: 1,
    bail: false
};