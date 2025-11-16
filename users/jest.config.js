export default {
    testEnvironment: 'node',
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/logs/'
    ],
    testMatch: [
        '**/Test/**/*.test.js',
        '**/__tests__/**/*.test.js',
        '**/?(*.)+(spec|test).js'
    ],
    transform: {},
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/server.js',
        '!src/utils/logger.js'
    ],
    testTimeout: 60000,
    verbose: true,
    detectOpenHandles: true,
    forceExit: true
};