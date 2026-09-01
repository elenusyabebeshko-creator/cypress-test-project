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
    selectRandomModel() {
        cy.get('#addCarModel')
            .find('option')
            .should('have.length.greaterThan', 1)
            .then($options => {
                const randomIndex = Cypress._.random(1, $options.length - 1);
                cy.get('#addCarModel').select(randomIndex);
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
