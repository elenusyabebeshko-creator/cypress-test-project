class ExpensesPage {
    //По факту поле передзаповнене тим авто, з картки якого відкрита форма, тому 1
    // Якщо треба інше авто - то треба підставити реальний id select'а
    selectFirstAvailableVehicle() {
        cy.get('#addExpenseCar').should('be.visible').select(1);
        return this;
    }

    fillDate(date) {
        cy.get('#addExpenseDate').clear();
        cy.get('#addExpenseDate').type(date);
        return this;
    }

    // Отримала еррор - "New mileage must not be equal to any today's expense values"
    // пробіг expense не може повторювати пробіг жодного вже доданого сьогодні expense для цього ж авто
    // Тому виклики передають сюди динамічно згенероване значення, а не константу
    fillMileage(mileage) {
        cy.get('#addExpenseMileage').clear();
        cy.get('#addExpenseMileage').type(String(mileage));
        return this;
    }

    fillLiters(liters) {
        cy.get('#addExpenseLiters').clear();
        cy.get('#addExpenseLiters').type(String(liters));
        return this;
    }

    fillTotalCost(cost) {
        cy.get('#addExpenseTotalCost').clear();
        cy.get('#addExpenseTotalCost').type(String(cost));
        return this;
    }

    // "Add" в ngb-modal-window
    confirmAddExpense() {
        cy.get('ngb-modal-window')
            .should('be.visible')
            .contains('button', 'Add')
            .should('be.enabled')
            .click();
        return this;
    }

    appearedExpenseSuccessAlert() {
        cy.contains('.alert.alert-success', 'Fuel expense added').should(
            'be.visible'
        );
        return this;
    }

    // Дата у форматі dd.mm.yyyy
    // еррор "New expense date must not be less than car creation date"
    // дата expense не може бути раніша за дату створення авто
    // Якщо авто створюється в тому ж тесті (тобто "сьогодні"), сюди треба передавати сьогоднішню дату, а не фіксовану дефолтну
    // дефолт нижче лише для довідки й підходить тільки для авто, створеного до цієї дати.
    addNewExpense({ date, mileage, liters = '40', totalCost = '55' } = {}) {
        this.fillDate(date);
        this.fillMileage(mileage);
        this.fillLiters(liters);
        this.fillTotalCost(totalCost);
        this.confirmAddExpense();
        this.appearedExpenseSuccessAlert();
        return this;
    }
}

module.exports = new ExpensesPage();
