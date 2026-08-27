import { validUser, uniqueEmail } from '../support/testData';

describe('Login flow via custom command', () => {
    const email = uniqueEmail();

    before(() => {
        // спершу реєструю нового юзера через UI, щоб мати валідні креди
        cy.visit('/', {
            auth: { username: 'guest', password: 'welcome2qauto' },
        });
        cy.contains('button', 'Sign up').click();
        cy.get('#signupName').type(validUser.name);
        cy.get('#signupLastName').type(validUser.lastName);
        cy.get('#signupEmail').type(email);
        cy.get('#signupPassword').type(validUser.password, { sensitive: true });
        cy.get('#signupRepeatPassword').type(validUser.password, {
            sensitive: true,
        });
        cy.contains('button', 'Register').should('be.enabled').click();
        cy.url().should('include', '/panel/garage');

        // вилогінюємось через кнопку "Log out" у бічному меню, щоб далі перевірити окремий флоу логіну через кастомну команду
        cy.contains('a', 'Log out').click();
    });

    it('should log in an existing user via the custom login command', () => {
        cy.login(email, validUser.password);
    });
});
