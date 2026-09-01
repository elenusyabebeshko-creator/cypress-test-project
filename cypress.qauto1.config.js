const { defineConfig } = require('cypress');
const reporterConfig = require('./cypress/config/reporter.config');

module.exports = defineConfig({
    ...reporterConfig,

    env: {
        // email/пароль реально зареєстрованого юзера 1 на qauto.forstudy.space
        userEmail: 'elenusyabebeshko+21.1@gmail.com',
        userPassword: 'Password300826',
    },

    e2e: {
        baseUrl: 'https://qauto.forstudy.space',
        viewportWidth: 1280,
        viewportHeight: 720,
        defaultCommandTimeout: 8000,
        video: false,
        screenshotOnRunFailure: true,
        setupNodeEvents() {
            // тут можна підключати плагіни/події
        },
    },
});
