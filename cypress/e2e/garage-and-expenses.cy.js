const garagePage = require('../pages/GaragePage');
const expensesPage = require('../pages/ExpensesPage');

describe('Garage and Fuel expenses scenarios', () => {
    beforeEach(() => {
        // Логін моїм попередньо зареєстрованим юзером (креди з cypress.qauto1.config.js / cypress.qauto2.config.js).
        cy.loginAsRegisteredUser();
    });

    it('Adding a new car to the garage', () => {
        garagePage.visit();
        garagePage.addNewCar({ mileage: '15000' });
    });

    it('Adding a fuel expense to an existing car', () => {
        // Error "New mileage must not be equal to any today's expense values")
        // Тому застосовую динамічну генерацію пробігу за аналогією з uniqueEmail() з HW 20.1
        const uniqueMileage = 20000 + (Date.now() % 100000);

        // Error "New expense date must not be less than car creation date"
        // Error "Report date has to be less than tomorrow"
        // Тобто  значення повинно = сьогоднішня дата і у UTC, а не локальне, т.як. бекенд рахує "сьогодні" за UTC (car creation date у застосунку теж у форматі GMT)
        // У часовому поясы пр Київу - UTC+3, тому локальна календарна дата вночі (00:00–03:00) вже "переходить" на наступний день, тоді як за UTC це ще вчорашній день, тому отримала цей еррор
        // getUTCMonth/getUTCFullYear уникають цього розсинхрону.
        const today = new Date();
        const todayFormatted = [
            String(today.getUTCDate()).padStart(2, '0'),
            String(today.getUTCMonth() + 1).padStart(2, '0'),
            today.getUTCFullYear(),
        ].join('.');

        // НЕ створюю нове авто через addNewCar(), а використовую те, що вже є в гаражі (наприклад, додане попереднім тестом цього ж файлу)
        // Оскільки 1) застосунок має ліміт кількості авто в гаражі з еррором "Cars limit reached" при POST /api/cars, коли ліміт вичерпан
        // 2) саме формулювання завдання ("add fuel expenses to A CAR") не вимагає щоразу нового авто — досить будь-якого наявного
        garagePage.visit();

        // Кнопка "Add fuel expense" знаходиться прямо на картці авто в Garage (button.car_add-expense.btn.btn-success)
        // => відкриваю модалку "Add an expense" через цю кнопку, а не через ExpensesPage.selectFirstAvailableVehicle() (але в коды нехай лишиться для довідки, що так можна)
        // модалка "Add an expense" відкривається поверх тієї ж сторінки
        garagePage.openAddFuelExpenseForm();
        expensesPage.addNewExpense({
            date: todayFormatted,
            mileage: uniqueMileage,
            liters: '35',
            totalCost: '48',
        });
    });
});
