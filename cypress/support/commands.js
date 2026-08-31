// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Кастомна команда login(), яка буде виконувати логін із заданими кредами для входу у систему через UI:
Cypress.Commands.add('login', (email, password) => {
    cy.visit('/', { auth: { username: 'guest', password: 'welcome2qauto' } });
    cy.contains('button', 'Sign In').click();

    cy.get('#signinEmail').type(email);
    cy.get('#signinPassword').type(password, { sensitive: true });

    cy.contains('button', 'Login').click();

    cy.url().should('include', '/panel/garage');
    cy.contains(
        '.alert.alert-success',
        'You have been successfully logged in'
    ).should('be.visible');
});

// Логін заздалегідь зареєстрованим юзером, креди якого зберігаються в env поточної конфігурації (cypress.qauto1.config.js / cypress.qauto2.config.js).
// один і той самий тест логіниться під різним юзером залежно від того, яка конфігурація обрана для запуску (qauto1 чи qauto2) — і не треба щоразу хардкодити юзер/пароль у тесті.

// застарілий варіант, який не працює з TypeScript (бо не знає про env юзера)
/*Cypress.Commands.add('loginAsRegisteredUser', () => {
    const email = Cypress.env('userEmail');
    const password = Cypress.env('userPassword');
    cy.login(email, password);
});
*/

//оновлений варіант, який працює з TypeScript (бо явно вказує, що повертає обʼєкт із полями userEmail і userPassword)
Cypress.Commands.add('loginAsRegisteredUser', () => {
    cy.env(['userEmail', 'userPassword']).then(
        ({ userEmail, userPassword }) => {
            cy.login(userEmail, userPassword);
        }
    );
});

// Перевизначення команди type у відповідності з прикладом з документації https://docs.cypress.io/api/cypress-api/custom-commands#Overwrite-Existing-Commands
// для того, щоб при вводі паролів сам пароль не відображався у логах Cypress — маскування паролів у Command Log
Cypress.Commands.overwrite('type', (originalFn, element, text, options) => {
    if (options && options.sensitive) {
        // turn off original log
        options.log = false;
        // create our own log with masked message
        Cypress.log({
            $el: element,
            name: 'type',
            message: '*'.repeat(text.length),
        });
    }

    return originalFn(element, text, options);
});
