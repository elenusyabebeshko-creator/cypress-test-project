// Page Object для сторінки /panel/expenses (список fuel expenses по авто)
// Це додаткова сторінка/DOM за принципом POM як ExpensesPage.js і GaragePage.js
//
// DevTools: button#carSelectDropdown (перемикач авто), ul.car-select-dropdown_menu >
// li.car-select-dropdown_item, table.expenses_table > tbody > tr > td
// порядок колонок: Date, Mileage, Liters used, Total cost

class ExpensesListPage {
    visit() {
        cy.visit('/panel/expenses', {
            auth: { username: 'guest', password: 'welcome2qauto' },
        });
        return this;
    }

    // Перемикач авто вгорі сторінки (потрібен, коли в гаражі кілька авто —
    // таблиця показує expenses лише для обраного)
    // пункт у списку, що відповідає ВЖЕ обраному (активному) авто, у розмітці має класи "-active disabled" і
    // CSS `pointer-events: none` — тобто по ньому фізично не можна клікнути
    // (`CypressError: ... has CSS 'pointer-events: none'`)
    // тобто на момент виклику selectCar() потрібне авто вже обране, клік по ньому в випадаючому списку не неможливий
    // Тому спершу звіряємо поточний текст кнопки-перемикача
    // і клікаємо по пункту списку лише якщо обране зараз авто — НЕ те, що нам треба
    selectCar(carName) {
        cy.get('#carSelectDropdown').then($button => {
            const currentlySelectedCar = $button.text().trim();

            if (currentlySelectedCar.startsWith(carName)) {
                // Потрібне авто вже активне — нічого клікати не треба (та й
                // відповідний пункт у списку задизейблений як активний).
                return;
            }

            cy.get('#carSelectDropdown').click();
            cy.get('.car-select-dropdown_menu')
                .contains('.car-select-dropdown_item', carName)
                .click();
        });
        return this;
    }

    expensesRows() {
        return cy.get('table.expenses_table tbody tr');
    }

    // Знаходить рядок за пробігом (mileage — унікальне значення в межах дня,
    // див. HW 21.1) і повертає його для подальших асертів по клітинках.
    expenseRowByMileage(mileage) {
        return this.expensesRows().contains('tr', String(mileage));
    }
}

module.exports = new ExpensesListPage();
