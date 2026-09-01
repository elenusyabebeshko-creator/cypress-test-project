const js = require('@eslint/js');
const globals = require('globals');
const cypressPlugin = require('eslint-plugin-cypress');
const prettierConfig = require('eslint-config-prettier');
const prettierPlugin = require('eslint-plugin-prettier');

module.exports = [
    {
        ignores: ['cypress/e2e/2-advanced-examples/**'],
    },
    js.configs.recommended,
    {
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.browser,
            },
        },
        plugins: { prettier: prettierPlugin },
        rules: {
            'prettier/prettier': 'error',
        },
    },
    {
        files: [
            'cypress/**/*.cy.js',
            'cypress/support/**/*.js',
            'cypress/pages/**/*.js',
        ],
        ...cypressPlugin.configs.recommended,
        languageOptions: {
            ...cypressPlugin.configs.globals.languageOptions,
        },
    },
    prettierConfig,
];
