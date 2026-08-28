const { defineConfig } = require('cypress');

module.exports = defineConfig({
    allowCypressEnv: false,
    e2e: {
        baseUrl: 'https://qauto.forstudy.space',
        viewportWidth: 1280,
        viewportHeight: 720,
        defaultCommandTimeout: 10000,
        video: false,
        screenshotOnRunFailure: true,
        // eslint-disable-next-line no-unused-vars
        setupNodeEvents(on, config) {
            // тут можна підключати плагіни/події
        },
    },
});
