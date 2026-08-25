describe('Header and footer elements', () => {
    beforeEach(() => {
        cy.visit('/', {
            auth: {
                username: 'guest',
                password: 'welcome2qauto',
            },
        });
    });

    it('should find all buttons in the header and verify they are visible', () => {
        cy.get('header')
            .find('button')
            .should('have.length.greaterThan', 1)
            .each($button => {
                cy.wrap($button).should('be.visible');
            });
    });

    it('should find all links and buttons in the footer and verify they are visible', () => {
        cy.get('#contactsSection')
            .find('a, button')
            .should('have.length.greaterThan', 1)
            .each($item => {
                cy.wrap($item).should('be.visible');
            });
    });
});
