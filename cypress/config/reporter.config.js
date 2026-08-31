// Спільні налаштування mochawesome-репортера, щоб не дублювати
// їх в обох конфіг-файлах (cypress.qauto1.config.js / cypress.qauto2.config.js).
module.exports = {
    reporter: 'mochawesome',
    reporterOptions: {
        reportDir: 'cypress/reports/mocha',
        reportFilename: '[name]',
        overwrite: true,
        html: false,
        json: true,
    },
};
