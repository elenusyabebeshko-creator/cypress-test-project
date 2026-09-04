const garagePage = require('../pages/GaragePage');
const expensesListPage = require('../pages/ExpensesListPage');

// Пробіг — звичайне фіксоване тестове значення
// Бренд і модель обираються рандомно і запамятовуються
const CAR_MILEAGE = 15000;

describe('HW 22.1: API testing with Cypress', () => {
    // Змінні оголошені на рівні describe , оскільки оголошенн їх у фікстурі/cy.writeFile недоречне
    // бо вони створюються динамічно і кожний раз різні
    let carBrand;
    let carModel;
    let carId;

    beforeEach(() => {
        cy.loginAsRegisteredUser();
    });

    // пп 2-3: створення авто через UI + interception респонсу + звірка через GET /api/cars
    it('should create a car via UI with random brand/model, intercept POST /api/cars and verify it via GET /api/cars', () => {
        cy.intercept('POST', '/api/cars').as('createCar');

        garagePage.visit();
        garagePage.openAddCarForm();
        garagePage.selectRandomBrand();
        garagePage.selectRandomModel();

        // Запам'ятовуємо реально обрані бренд і модель — GaragePage кладе їх в Cypress-аліаси
        //  (@selectedCarBrand/@selectedCarModel) у момент вибору
        // а тут забираємо ці значення у звичайні змінні спек-файлу, щоб використати далі для звірки з відповіддю API
        cy.get('@selectedCarBrand').then(brand => {
            carBrand = brand;
        });
        cy.get('@selectedCarModel').then(model => {
            carModel = model;
        });

        garagePage.fillMileage(CAR_MILEAGE);
        garagePage.confirmAddCar();
        garagePage.appearedCarSuccessAlert();

        cy.wait('@createCar').then(({ response }) => {
            // Розбіжність зі специфікацією: /api-docs документує 200 для POST /cars але РЕАЛЬНО застосунок повертає 201
            expect(response.statusCode).to.equal(201);
            expect(response.body.status).to.equal('ok');
            expect(response.body.data.id).to.be.a('number');
            // Response уже містить brand/model, обрані у формі
            // додаткова швидка перевірка, що інтерцепт зловив саме наш запит
            expect(response.body.data.brand).to.equal(carBrand);
            expect(response.body.data.model).to.equal(carModel);

            carId = response.body.data.id;
        });

        cy.request({
            method: 'GET',
            url: '/api/cars',
            auth: { username: 'guest', password: 'welcome2qauto' },
        }).then(({ status, body }) => {
            expect(status).to.equal(200);
            expect(body.status).to.equal('ok');

            const createdCar = body.data.find(car => car.id === carId);

            expect(createdCar, 'GET /api/cars має містити щойно створене авто')
                .to.exist;
            // Звіряємо саме з тими значеннями, які реально були обрані в UI при створенні авто (carBrand/carModel)
            expect(createdCar.brand).to.equal(carBrand);
            expect(createdCar.model).to.equal(carModel);
            expect(createdCar.mileage).to.equal(CAR_MILEAGE);
        });
    });

    // пп.4-5: створення expense через API (кастомна команда) + звірка через UI
    it('should create an expense via API for the created car and verify it via UI', () => {
        expect(
            carId,
            'carId має бути встановлений попереднім тестом (it вище)'
        ).to.be.a('number');

        // Враховано ті самі правила, що й у HW 21.1:
        // дата expense не може бути раніша за дату створення авто й не може бути пізніша за "завтра"
        // -> єдине надійне значення — сьогодні, і рахувати його треба за UTC
        // пробіг не може повторювати пробіг іншого expense цього ж авто за сьогодні -> динамічна генерація
        // В приципі в цьому тесті авто щойно створене (без жодних expenses), тому накладка по пробігу неможлива в принципі
        // але лишаю код по генерації для стабільності при повторних прогонах тесту
        const today = new Date();
        const reportedAtIso = [
            today.getUTCFullYear(),
            String(today.getUTCMonth() + 1).padStart(2, '0'),
            String(today.getUTCDate()).padStart(2, '0'),
        ].join('-');
        const reportedAtTableFormat = [
            String(today.getUTCDate()).padStart(2, '0'),
            String(today.getUTCMonth() + 1).padStart(2, '0'),
            today.getUTCFullYear(),
        ].join('.');
        const mileage = 20000 + (Date.now() % 100000);
        const liters = 40;
        const totalCost = 550;

        cy.createExpenseViaApi({
            carId,
            reportedAt: reportedAtIso,
            mileage,
            liters,
            totalCost,
            forceMileage: false,
        }).then(({ status, body }) => {
            expect(status).to.eq(200);
            expect(body.status).to.eq('ok');
            expect(body.data.id).to.be.a('number');
            expect(body.data.carId).to.eq(carId);
            expect(body.data.mileage).to.eq(mileage);
            expect(body.data.liters).to.eq(liters);
            expect(body.data.totalCost).to.eq(totalCost);
            // reportedAt повертається як повний ISO-рядок ("...T00:00:00.000Z"), а не лише дата
            // тому звіряємо префікс, а не точну рівність рядків.
            expect(body.data.reportedAt).to.contain(reportedAtIso);
        });

        const carName = `${carBrand} ${carModel}`;

        expensesListPage.visit();

        expensesListPage.selectCar(carName);
        expensesListPage
            .expenseRowByMileage(mileage)
            .should('be.visible')
            .within(() => {
                cy.get('td').eq(0).should('have.text', reportedAtTableFormat);
                cy.get('td').eq(1).should('have.text', String(mileage));
                cy.get('td').eq(2).should('have.text', `${liters}L`);
                cy.get('td').eq(3).should('contain', `${totalCost}.00 USD`);
            });
    });
});
