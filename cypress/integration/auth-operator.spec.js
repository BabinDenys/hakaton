
const host = Cypress.env('host');
const login = Cypress.env('login');
const password = Cypress.env('password');
const email = Cypress.env('email');

context('Авторизация оператора', () => {
  beforeEach(() => {
    cy.visit(host)
    cy.contains('Форма входа')
  })

  //Успешный вход в личный кабинет: по логину
  it('Успешная авторизация по логину', () => {

    cy.get('.name-input input')
      .type(login).should('have.value', login)

    cy.get('.password-input input')
      .type(password).should('have.value', password)

    cy.get('.el-button')
      .click()

    cy.url().should('include', '/operator/list')
  })

  //Успешный вход в личный кабине: по email
  it('Успешная авторизация по email', () => {

    cy.get('.name-input input')
      .type(email).should('have.value', email)

    cy.get('.password-input input')
      .type(password).should('have.value', password)

    cy.get('.el-button')
      .click()

    cy.url().should('include', '/operator/list')

  })

  //Ошибка авторизации: неверный логин
  it('Неверный логин', () => {

    cy.get('.name-input input')
      .type('operator').should('have.value', 'operator')

    cy.get('.password-input input')
      .type('operator1operator1').should('have.value', 'operator1operator1')

    cy.get('.el-button')
      .click()

    cy.contains('Request failed with status code 403') //Прописать нормальную ошибку
      .should('exist')
  })

  //Ошибка авторизации: неверный пароль
  it('Неверный пароль', () => {

    cy.get('.name-input input')
      .type('operator1').should('have.value', 'operator1')

    cy.get('.password-input input')
      .type('operator').should('have.value', 'operator')

    cy.get('.el-button')
      .click()

    cy.contains('Request failed with status code 403') //Прописать нормальную ошибку
      .should('exist')
  })


//  Ошибка авторизации: Данные не введены
  it('Данные не введены', () => {
    //Пустая форма
    cy.get('.el-button')
      .click()
    cy.contains('failed with status code') //Прописать нормальную ошибку

    //Без пароля
    cy.get('.name-input input')
      .type(login).should('have.value', login)
    cy.get('.el-button')
      .click()
    cy.contains('failed with status code') //Прописать нормальную ошибку
    cy.get('.name-input input')
      .clear()

    //Без логина
    cy.get('.password-input input')
      .type(password).should('have.value', password)
    cy.get('.el-button')
      .click()
    cy.contains('failed with status code') //Прописать нормальную ошибку
  })

})
