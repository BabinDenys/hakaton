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
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

const host = Cypress.env('host');
const urlCreateProduct = Cypress.env('urlCreateProduct');
const urlListProduct = Cypress.env('urlListProduct');
const urlCreateCategory = Cypress.env('urlCreateCategory');
const urlListCategory = Cypress.env('urlListCategory');
const login = Cypress.env('login');
const password = Cypress.env('password');

//Авторизация - прямая
Cypress.Commands.add("authSuccess", () => {
  cy.visit(host)
  cy.get('.name-input input')
    .type(login).should('have.value', login)
  cy.get('.password-input input')
    .type(password).should('have.value', password)
  cy.get('.el-button')
    .click()
  cy.wait(1500)
  //Проверяет наличие /operator/list в url
  cy.url().should('include', '/operator/')
})

//Создание категории товаров "Консервные рыбы"
Cypress.Commands.add("createCategory", () => {
  cy.visit(urlCreateCategory)
  cy.get('.cy-category-input input')
    .type('Консервные рыбы').should('have.value', 'Консервные рыбы')

  cy.get('.el-button')
    .click()
  cy.contains('Категория добавлена')
    .should('exist')

  cy.visit(urlListCategory)
  cy.wait(1000)
  cy.get('.el-pager > :last-child')
    .click()
  cy.contains('Консервные рыбы')
    .should('exist')

})


//Создание товара "Шпротики" в категории "Консервные рыбы"
Cypress.Commands.add("createProduct", () => {
  cy.createCategory()
  cy.visit(urlCreateProduct)
  cy.contains('Создание продукта')
    .should('exist')

  cy.get('div > .el-input--suffix')
    .click()
  cy.contains('Консервные рыбы')
    .click()

  cy.get('.page-container > :nth-child(2) > .el-input > .el-input__inner')
    .type('Шпротики').should('have.value','Шпротики')

  cy.get('.el-textarea__inner')
    .type('Мои шпротики!').should('have.value','Мои шпротики!')

  cy.get('.el-button')
    .click()
  cy.contains('Товар добавлен')
    .should('exist')

  cy.visit(urlListProduct)
  cy.wait(1000)
  cy.get('.el-pager > :last-child')
    .click()
  cy.contains('Шпротики')
    .should('exist')
})

//Удаление категории


//Удаление товара


// Мокаем авторизацию

const token = Cypress.env('token')

Cypress.Commands.add("mokeAuth", () => {
  cy.server()
  cy.visit(host)
  cy.contains('Форма входа')
  cy.get('.name-input input')
    .type('login').should('have.value', 'login')

  cy.get('.password-input input')
    .type('password').should('have.value', 'password')
  cy.route('POST', 'http://84.201.156.217:8001/content/login/', token)
  cy.get('.el-button')
    .click()
})

//Разлогинеться



//Установить куки
const tokenCookies = "JWT%20eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNTkzMDE4MTQ2LCJqdGkiOiIxZDQ2MGQ3YjQ3YjY0OTcwOGViYmU1ZmNiZDU1Y2MyOCIsInVzZXJfaWQiOjJ9.qPvVP27wwLOG3oJIILYBnskcKhT0yqEEvInB_x-SGEo"
const nameCookies = "Admin-Token"

Cypress.Commands.add('cookieSetMoke', () => {
  cy.setCookie(nameCookies, tokenCookies)

})
