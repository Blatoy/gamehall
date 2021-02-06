module.exports = function (config) {
    config.set({
        basePath: './',
        frameworks: ['mocha', 'karma-typescript'],
        browsers: ['Chrome'],
        files: [
            { pattern: './test/**/*.spec.ts', type: 'module' },
            { pattern: './src/**/*.ts', type: 'module', included: false },
        ],
        preprocessors: {
            "./test/**/*.ts": "karma-typescript",
            "./src/**/*.ts": "karma-typescript",
        },
        reporters: ["progress", "karma-typescript"],
        karmaTypescriptConfig: {
            tsconfig: "./tsconfig.test.json"
        }
    });
};
