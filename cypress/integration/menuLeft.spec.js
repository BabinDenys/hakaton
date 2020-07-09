


context('Страница списка категорий товаров',() =>{

  // before(() => {
  //   cy.mokeAuth()
  // })

  beforeEach(() => {
    cy.cookieSetMoke()

  })

  it('Страницы находятся на нужном месте',() => {

    cy.contains('Категории')
          .click()


    cy.contains('Создание категории')
      .click()
    cy.url().should('include','/categories/createCategory')

    cy.contains('Создание товара')
      .click()
    cy.url().should('include','/operator/createProduct')

    cy.contains('Список категорий')
      .click()
    cy.url().should('include','/categories/categories')

    cy.contains('Список товаров')
      .click()
    cy.url().should('include','/operator/list')

    cy.contains('Профиль')
      .click()
    cy.url().should('include','/settings/profile')

  })

  it('Открытие/закрытие меню',() => {
    cy.get('.navbar > #hamburger-container > .hamburger')
      .click()
    cy.get('div > .app-wrapper')
      .should('have.class','hideSidebar')

    cy.get('.navbar > #hamburger-container > .hamburger')
      .click()
    cy.get('div > .app-wrapper')
      .should('have.class','openSidebar')

    cy.get('.sidebar-container > #hamburger-container')
      .click()
    cy.get('div > .app-wrapper')
      .should('have.class','hideSidebar')
  })

})
