
const urlCreateProduct = Cypress.env('urlCreateProduct');
const urlListProduct = Cypress.env('urlListProduct');
const nameProductWeight = "Абрикосики"
const nameProductNotWeight ="Шпротинка"
const urlProfile = Cypress.env('urlProfile')


const nameProductWeightIdDelete = "#Абрикосики_Удалить"
const nameProductNotWeightIdDelete ="#Шпротинка_Удалить"

context('Создание весового продукта', () => {
  before(() => {

    cy.cookieSetMoke()
    cy.visit((urlListProduct))
    cy.get('.search-input > .el-input__inner')
      .type('брикосики')

    cy.get(':nth-child(2) > .el-input > .el-input__inner').click()
    cy.contains('Весовой').click()

    cy.get('.search > .el-button--success').click()
    cy.contains('Нет данных').should('exist')

  })
  beforeEach(() => {
    cy.cookieSetMoke()
    cy.visit(urlCreateProduct)
    cy.contains('Создание продукта')
      .should('exist')
  })

  after(() => {
    cy.visit(urlListProduct)
    cy.wait(1000)
    cy.get('.el-pager > :last')
      .click()
    cy.get(nameProductWeightIdDelete)
      .click()
    // cy.contains(nameProductWeight).should("exist")
    cy.get('.dialog-footer > .el-button--danger')
      .click()

  })

//  Создание весового продукта Абрикосики
  it('Создание весового продукта', () => {
    cy.get('div > .el-input--suffix')
      .click()
    cy.get('.el-select-dropdown__wrap > .el-scrollbar__view > :nth-child(1)')
      .click()

    cy.get('.page-container > :nth-child(2) > .el-input > .el-input__inner')
      .type(nameProductWeight).should('have.value',nameProductWeight)

    cy.get('.el-textarea__inner')
      .type('И вместе мы пойдем на луну').should('have.value','И вместе мы пойдем на луну')

    cy.get('.el-button')
      .click()
    cy.contains('Товар добавлен')
      .should('exist')

    cy.visit(urlListProduct)
    cy.wait(1000)
    cy.get('.el-pager > :last-child')
      .click()
    cy.contains(nameProductWeight)
      .should('exist')
  })

  // Ошибка: создание существующего продукта Абрикосики
  it('Ошибка: Создание существующего продукта', () => {
    cy.get('div > .el-input--suffix')
      .click()
    cy.get('.el-select-dropdown__wrap > .el-scrollbar__view > :nth-child(1)')
      .click()

    cy.get('.page-container > :nth-child(2) > .el-input > .el-input__inner')
      .type(nameProductWeight).should('have.value',nameProductWeight)

    cy.get('.el-textarea__inner')
      .type('Товар!').should('have.value','Товар!')

    cy.get('.el-button')
      .click()
    cy.contains('Не получилось добавить товар')
      .should('exist')
  })

})

context('Создание не весового продукта',() => {

  before(() => {
    cy.mokeAuth()
    cy.visit((urlListProduct))
    cy.get('.search-input > .el-input__inner')
      .type('протики')

    cy.get(':nth-child(2) > .el-input > .el-input__inner').click()
    cy.contains('Не весовой').click()

    cy.get('.search > .el-button--success').click()
    cy.contains('Нет данных').should('exist')
    cy.visit(urlProfile)
    cy.get('.el-button').click()
  })

  beforeEach(() => {
    cy.mokeAuth()
    cy.visit(urlCreateProduct)

    cy.contains('Создание продукта')
      .should('exist')
  })

  after(() => {

    cy.visit(urlListProduct)
    cy.wait(1000)
    cy.get('.el-pager > :last-child')
      .click()
    cy.get(nameProductNotWeightIdDelete)
      .click()
    cy.contains(nameProductNotWeight)
      .should("exist")
    cy.get('.dialog-footer > .el-button--danger')
      .click()
    cy.wait(1000)

  })

  //Создание невесового продукта
  it('Создание поштучного продукта', () => {
    cy.get('div > .el-input--suffix')
      .click()
    cy.get('.el-select-dropdown__wrap > .el-scrollbar__view > :nth-child(1)')
      .click()

    cy.get('.page-container > :nth-child(2) > .el-input > .el-input__inner')
      .type(nameProductNotWeight).should('have.value',nameProductNotWeight)

    cy.get('.el-switch__core')
      .click()

    cy.get('.el-textarea__inner')
      .type('Товар поштучно!').should('have.value','Товар поштучно!')

    cy.get('.el-button')
      .click()
    cy.contains('Товар добавлен')
      .should('exist')

    cy.visit(urlListProduct)
    cy.wait(1000)
    cy.get('.el-pager > :last-child')
      .click()
    cy.contains(nameProductNotWeight)
      .should('exist')

  })

  //Ошибка: Создание существующего продукта
  it('Ошибка: Создание существующего продукта', () => {
    cy.get('div > .el-input--suffix')
      .click()
    cy.get('.el-select-dropdown__wrap > .el-scrollbar__view > :nth-child(1)')
      .click()

    cy.get('.page-container > :nth-child(2) > .el-input > .el-input__inner')
      .type(nameProductNotWeight).should('have.value',nameProductNotWeight)

    cy.get('.el-switch__core')
      .click()

    cy.get('.el-textarea__inner')
      .type('Товар поштучно!').should('have.value','Товар поштучно!')

    cy.get('.el-button')
      .click()
    cy.contains('Не получилось добавить товар')
      .should('exist')

  })

})

context('Создание не весового продукта с названием весового продукта', () => {
  before(() => {
    cy.mokeAuth()
    cy.visit((urlListProduct))
    cy.get('.search-input > .el-input__inner')
      .type('омидор')

    cy.get(':nth-child(2) > .el-input > .el-input__inner').click()
    cy.contains('Весовой').click()

    cy.get('.search > .el-button--success').click()
    cy.contains('омидор').should('exist')
    cy.visit(urlProfile)
    cy.get('.el-button').click()
  })
  beforeEach(() => {
    cy.mokeAuth()
    cy.visit(urlCreateProduct)
    cy.contains('Создание продукта')
      .should('exist')
  })

   after(() => {
     cy.visit(urlListProduct)
     cy.wait(1000)
     cy.get('.el-pager > :last-child')
       .click()
     cy.get('#Помидор_Удалить')
       .click()
     cy.contains('Помидор')
       .should("exist")
     cy.get('.dialog-footer > .el-button--danger')
       .click()
     cy.wait(1000)
   })

  it('Создание не весового продукта с названием весового продукта', () => {

    cy.get('div > .el-input--suffix')
      .click()
    cy.get('.el-select-dropdown__wrap > .el-scrollbar__view > :nth-child(1)')
      .click()

    cy.get('.page-container > :nth-child(2) > .el-input > .el-input__inner')
      .type('Помидор').should('have.value','Помидор')

    cy.get('.el-switch__core')
      .click()

    cy.get('.el-textarea__inner')
      .type('Товар!').should('have.value','Товар!')

    cy.get('.el-button')
      .click()
    cy.contains('Товар добавлен')
      .should('exist')

    cy.visit(urlListProduct)
    cy.wait(1000)
    cy.get('.el-pager > :last-child')
      .click()
    cy.contains('Помидор')
      .should('exist')
  })

})
