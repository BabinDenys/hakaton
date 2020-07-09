
const urlCreateCategory = Cypress.env('urlCreateCategory');
const urlListCategory = Cypress.env('urlListCategory');
const nameCategory = "Булочная"
const idNameCategory = "#Булочная"


context('Создание категории товара',() => {

  //Удаление категорий после тестов
  after(() => {
    cy.visit(urlListCategory)
    cy.wait(1000)
    cy.get('.el-pager > :last-child')
      .click()
    cy.get(idNameCategory)
      .click()
    cy.contains(nameCategory).should('exist')
    cy.get('.dialog-footer > .el-button--danger').contains('Удалить')
      .click()
    cy.contains('Категория удалена').should('exist')
  })

  beforeEach(() => {
    cy.cookieSetMoke()
    cy.visit(urlCreateCategory)
    cy.wait(1500)
    cy.contains('Создание категории')
      .should('exist')
  })


  //Успешное создание новой категории
  it('Создание категории', () => {
    cy.get('.cy-category-input input')
      .type(nameCategory).should('have.value', nameCategory)
    cy.get('.el-button')
      .click()
    cy.contains('Категория добавлена').should('exist')
    cy.visit(urlListCategory)
    cy.wait(1000)
    cy.get('.el-pager > :last-child')
      .click()
    cy.contains(nameCategory).should('exist')
  })

  //Неуспешное создание категории (дубликат)
  it('Создание повторяющейся категории', () => {
    cy.get('.cy-category-input input')
      .type(nameCategory).should('have.value', nameCategory)

    cy.get('.el-button')
      .click()
    cy.contains('Не получилось добавить категорию').should('exist')

  })

  it('Валидация поля', () =>{
    cy.get('.cy-category-input input').type('творог').should('have.value', 'Творог')
    cy.get('.cy-category-input input').clear()
    cy.get('.cy-category-input input').type(' ').should('have.value', '')
    cy.get('.cy-category-input input').clear()
    cy.get('.cy-category-input input').type('12').should('have.value', '12')
    cy.get('.cy-category-input input').clear()
    cy.get('.cy-category-input input').type('!%').should('have.value', '!%')
    cy.get('.cy-category-input input').clear()
    cy.get('.cy-category-input input').type('Tilziter').should('have.value', 'Tilziter')
  })

})
