const { defineConfig } = require('cypress');

module.exports = defineConfig({
    allowCypressEnv: false,

    e2e: {
        //baseUrl: 'http://localhost:3000', //щоб у тестах не писати повний URL щоразу;
        viewportWidth: 1280, //фіксований розмір вікна браузера;
        viewportHeight: 720, //фіксований розмір вікна браузера;
        defaultCommandTimeout: 8000, //збільшений таймаут очікування елементів;
        video: false, //вимкнено запис відео прогонів (щоб не засмічувати диск);
        screenshotOnRunFailure: true, //скріншот при падінні тесту.
        // eslint-disable-next-line no-unused-vars
        setupNodeEvents(on, config) {
            // тут можна підключати плагіни/події
        },
    },
});
