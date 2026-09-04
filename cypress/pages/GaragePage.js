class GaragePage {
    // Basic Auth (guest/welcome2qauto) треба передавати в КОЖЕН cy.visit(), а не лише в перший
    // !!! Cypress не кешує ці креденшели між окремими викликами visit(), навіть у межах одного тесту.
    // Без цього повторний visit('/panel/garage') після логіну у мене падав з 401 Unauthorized.
    visit() {
        cy.visit('/panel/garage', {
            auth: { username: 'guest', password: 'welcome2qauto' },
        });
        return this;
    }

    openAddCarForm() {
        cy.contains('button', 'Add car').should('be.enabled').click();
        return this;
    }

    // Варіант із вибором першого доступного бренду
    /*
  selectFirstAvailableBrand() {
    cy.get('#addCarBrand').should('be.visible').select(1);
    return this;
  }
  */

    // Варіант із вибором ВИПАДКОВОГО бренду зі списку
    // індекс 0 — заглушка на кшталт/ "Select brand", тому рандом рахуємо серед реальних варіантів: 1..length-1
    // Cypress._.random(min, max) — вбудований lodash, доступний як Cypress._.
    /*
    selectRandomBrand() {
        cy.get('#addCarBrand')
            .should('be.visible')
            .find('option')
            .then($options => {
                const randomIndex = Cypress._.random(1, $options.length - 1);
                cy.get('#addCarBrand').select(randomIndex);
            });
        return this;
    }
        */
    // для HW 22.1: обраний бренду запам'ятовується через Cypress-аліас
    // (cy.wrap(...).as('selectedCarBrand')) => тест, який створює авто через UI,
    // може потім дістати РЕАЛЬНО обране значення (cy.get('@selectedCarBrand'))
    // і звірити його з відповіддю API
    //
    // !!! ВИПРАВЛЕНО (реальний баг після прогону: AssertionError: expected 'Scudo' to equal 'A8'):
    // текст бренду читаємо З РЕЗУЛЬТАТУ select() ($select[0].selectedOptions[0].text),
    // а НЕ окремим cy.get() заздалегідь. Якщо читати текст ДО select() окремим запитом,
    // є ризик зловити DOM, який ще не встиг стабілізуватись (Angular міг ще не домалювати
    // список) — і "запам'ятоване" значення розійдеться з тим, що реально пішло на сервер.
    // Читання ПІСЛЯ select(), з того самого елемента, що select() повернув, — гарантовано
    // відповідає реальному стану.
    //
    // .select() навмисно НЕ зачіплена в один ланцюжок з .then() — ESLint-плагін
    // cypress/unsafe-to-chain-command попереджає, що команди на кшталт select/type/click
    // можуть змінити DOM, тож продовжувати ланцюжок далі небезпечно. Тому select() і
    // подальший .then() — це два ОКРЕМІ стейтменти (Cypress все одно виконає їх по черзі,
    // команди завжди чергою, а не паралельно).
    //
    // Також cy.wait('@getCarModels') підтверджує лише, що ВІДПОВІДЬ прийшла, а не що
    // Angular уже перемалював #addCarModel новим списком. Тому додатково чекаємо (з ретраями),
    // доки кількість <option> у #addCarModel зрівняється з кількістю моделей у самій відповіді —
    // це і є надійний сигнал, що DOM реально оновився під новий бренд.
    selectRandomBrand() {
        cy.intercept('GET', '/api/cars/models*').as('getCarModels');

        cy.get('#addCarBrand')
            .should('be.visible')
            .find('option')
            .should('have.length.greaterThan', 0)
            .then($options => {
                const randomIndex = Cypress._.random(0, $options.length - 1);
                cy.get('#addCarBrand').select(randomIndex);
                cy.get('#addCarBrand').then($select => {
                    const brandName = $select[0].selectedOptions[0].text.trim();
                    cy.wrap(brandName).as('selectedCarBrand');
                });
            });

        cy.wait('@getCarModels').then(({ response }) => {
            const models = Array.isArray(response.body)
                ? response.body
                : response.body.data;
            cy.get('#addCarModel')
                .find('option')
                .should('have.length', models.length);
        });

        return this;
    }

    // Варіант із вибором першого доступної моделі
    /*
  selectFirstAvailableModel() {
    cy.get('#addCarModel').should('be.visible').select(1);
    return this;
  }
  */

    // Варіант із вибором ВИПАДКОВОЇ моделі зі списку
    // Список моделей підвантажується асинхронно після вибору бренду (GET /api/cars/models?carBrandId=...),
    // тому спочатку чекаємо (через .should — з ретраями), доки options стане
    // більше одного (тобто підʼїде щось окрім заглушки "Select model").
    /*selectRandomModel() {
        cy.get('#addCarModel')
            .find('option')
            .should('have.length.greaterThan', 1)
            .then($options => {
                const randomIndex = Cypress._.random(1, $options.length - 1);
                cy.get('#addCarModel').select(randomIndex);
            });
        return this;
    }
*/
    //Для HW 22.1: так само, як і з брендом, обраний текст моделі запам'ятовується через аліас
    // cy.get('@selectedCarModel')
    //
    // !!! ВИПРАВЛЕНО: так само, як і в selectRandomBrand() — текст моделі читаємо ПІСЛЯ
    // select(), з реального стану елемента, а не заздалегідь окремим запитом до DOM.
    // select() і .then() так само розбиті на два окремі стейтменти (див. коментар
    // у selectRandomBrand() про ESLint-правило cypress/unsafe-to-chain-command).
    selectRandomModel() {
        cy.get('#addCarModel')
            .find('option')
            .should('have.length.greaterThan', 0)
            .then($options => {
                const randomIndex = Cypress._.random(0, $options.length - 1);
                cy.get('#addCarModel').select(randomIndex);
                cy.get('#addCarModel').then($select => {
                    const modelName = $select[0].selectedOptions[0].text.trim();
                    cy.wrap(modelName).as('selectedCarModel');
                });
            });
        return this;
    }

    fillMileage(mileage) {
        cy.get('#addCarMileage').clear();
        cy.get('#addCarMileage').type(String(mileage));
        return this;
    }

    // "Add" в ngb-modal-window
    confirmAddCar() {
        cy.get('ngb-modal-window')
            .should('be.visible')
            .contains('button', 'Add')
            .should('be.enabled')
            .click();
        return this;
    }

    appearedCarSuccessAlert() {
        cy.contains('.alert.alert-success', 'Car added').should('be.visible');
        return this;
    }

    // Кнопка "Add fuel expense" на картці авто в Garage (button.car_add-expense.btn.btn-success)

    openAddFuelExpenseForm() {
        cy.get('.car_add-expense').first().click();
        return this;
    }

    addNewCar({ mileage = '15000' } = {}) {
        this.openAddCarForm();
        // this.selectFirstAvailableBrand();
        this.selectRandomBrand();
        // this.selectFirstAvailableModel();
        this.selectRandomModel();
        this.fillMileage(mileage);
        this.confirmAddCar();
        this.appearedCarSuccessAlert();
        return this;
    }

    // Перший рядок доданого авто в списку (<li class="car-item"> всередині <ul class="car-list">).
    firstCarCard() {
        return cy.get('li.car-item').first();
    }

    // Назва авто на картці (<p class="car_name">).
    firstCarName() {
        return cy.get('.car_name').first();
    }
}

module.exports = new GaragePage();
