describe('conversations', () => {
  it('can name a new conversation', () => {
    cy.visit('/');
    cy.get('.list-controls .btnb').click();
    cy.get('.new-convo-input').type('new conversation test');
    cy.get('.list-controls .btn-action').click();
    cy.get('.activeConvoName .convoListValue').should('have.text', 'new conversation test');
  });

  it('can update the navigation header to the new conversation when making a new one', () => {
    cy.visit('/');
    cy.get('.list-controls .btnb').click();
    cy.get('.new-convo-input').type('navigation test');
    cy.get('.list-controls .btn-action').click();
    cy.get('.convo-nav-name').should('have.text', 'navigation test');
  });

  it('can save a new conversation to localstorage', () => {
    cy.visit('/');
    cy.get('.list-controls .btnb').click();
    cy.get('.new-convo-input').type('localstorage test');
    cy.get('.list-controls .btn-action').click();
    cy.getAllLocalStorage().then((result) => {
      const local = result['http://localhost:3000'].llamaTexts;
      const texts = JSON.parse(local);
      expect(texts[0].name).to.equal('localstorage test');
    })
  });

  it('can delete a conversation', () => {
    cy.visit('/');
    cy.get('.list-controls .btnb').click();
    cy.get('.new-convo-input').type('deletion of conversation test');
    cy.get('.list-controls .btn-action').click();
    cy.get('.activeConvoName button').click();

    cy.contains('.conversation-list', 'there are no conversations').should('be.visible');
  });
})