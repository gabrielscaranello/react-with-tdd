import React from 'react'
import { faker } from '@faker-js/faker'
import 'jest-localstorage-mock'
import { cleanup, fireEvent, render, RenderResult, waitFor } from '@testing-library/react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'

import Login from './login'
import { AuthenticationSpy, ValidationStub } from '@/presentation/test'
import { InvalidCredentialsError } from '@/domain/errors'

type SutTypes = {
  sut: RenderResult
  authenticationSpy: AuthenticationSpy
}

type SutParams = {
  errorMessage?: string
}
const history = createMemoryHistory()
const makeSut = (params?: SutParams): SutTypes => {
  const authenticationSpy = new AuthenticationSpy()
  const validationStub = new ValidationStub()
  validationStub.errorMessage = params?.errorMessage

  const sut = render(
    <Router history={history}>
      <Login validation={validationStub} authentication={authenticationSpy} />
    </Router>
  )
  return { sut, authenticationSpy }
}

const simulateValidSubmit = (sut: RenderResult, email?: string, password?: string): void => {
  populateFormField(sut, 'email', email)
  populateFormField(sut, 'password', password)
  fireEvent.submit(sut.getByTestId('submit'))
}

const populateFormField = (sut: RenderResult, field: string, value = faker.lorem.words()): void => {
  fireEvent.input(sut.getByTestId(field), { target: { value } })
}

const testStatusForField = (sut: RenderResult, field: string, errorMessage?: string): void => {
  const fieldStatus = sut.getByTestId(`${field}-status`)
  expect(fieldStatus.title).toBe(errorMessage ?? 'Tudo certo!')
  expect(fieldStatus.className).toMatch(errorMessage ? /statusError/ : /statusSuccess/)
}

describe('Login Component', () => {
  afterEach(cleanup)
  beforeEach(() => { localStorage.clear() })

  test('Should start with initial state', () => {
    const errorMessage = faker.lorem.words()
    const { sut } = makeSut({ errorMessage })
    const errorWrap = sut.getByTestId('error-wrap')
    const submitButton = sut.getByTestId('submit') as HTMLButtonElement

    expect(submitButton.disabled).toBe(true)
    expect(errorWrap.childElementCount).toBe(0)
    testStatusForField(sut, 'email', errorMessage)
    testStatusForField(sut, 'password', errorMessage)
  })

  test('Should show e-mail error if validation fails', () => {
    const errorMessage = faker.lorem.words()
    const { sut } = makeSut({ errorMessage })
    populateFormField(sut, 'email')
    testStatusForField(sut, 'email', errorMessage)
  })

  test('Should show password error if validation fails', () => {
    const errorMessage = faker.lorem.words()
    const { sut } = makeSut({ errorMessage })
    populateFormField(sut, 'password')
    testStatusForField(sut, 'password', errorMessage)
  })

  test('Should show valid email state if validation success', () => {
    const { sut } = makeSut()
    populateFormField(sut, 'email')
    testStatusForField(sut, 'email')
  })

  test('Should show valid password state if validation success', () => {
    const { sut } = makeSut()
    populateFormField(sut, 'password')
    testStatusForField(sut, 'password')
  })

  test('Should enable submit button if form is valid', () => {
    const { sut } = makeSut()
    const submitButton = sut.getByTestId('submit') as HTMLButtonElement
    populateFormField(sut, 'email')
    populateFormField(sut, 'password')
    expect(submitButton.disabled).toBe(false)
  })

  test('Should show loading on submit', () => {
    const { sut } = makeSut()
    simulateValidSubmit(sut)
    expect(sut.getByTestId('spinner')).toBeTruthy()
  })

  test('Should call authentication with correct values', () => {
    const { sut, authenticationSpy } = makeSut()
    const email = faker.internet.email()
    const password = faker.internet.password()
    simulateValidSubmit(sut, email, password)
    expect(authenticationSpy.params).toEqual({ email, password })
  })

  test('Should call authentication only once', () => {
    const { sut, authenticationSpy } = makeSut()
    simulateValidSubmit(sut)
    simulateValidSubmit(sut)
    expect(authenticationSpy.callsCount).toBe(1)
  })

  test('Should not call authentication if form is invalid', () => {
    const errorMessage = faker.lorem.words()
    const { sut, authenticationSpy } = makeSut({ errorMessage })
    populateFormField(sut, 'email')
    fireEvent.submit(sut.getByTestId('form'))
    expect(authenticationSpy.callsCount).toBe(0)
  })

  test('Should not call authentication if form is invalid', async () => {
    const { sut, authenticationSpy } = makeSut()
    const error = new InvalidCredentialsError()
    const errorWrap = sut.getByTestId('error-wrap')
    jest.spyOn(authenticationSpy, 'auth')
      .mockImplementationOnce(() => { throw error })

    simulateValidSubmit(sut)
    await waitFor(() => errorWrap)
    const mainError = sut.getByTestId('main-error')

    expect(errorWrap.childElementCount).toBe(1)
    expect(mainError.textContent).toBe(error.message)
  })

  test('Should add access token to localstorage on success', async () => {
    const { sut, authenticationSpy } = makeSut()
    simulateValidSubmit(sut)
    await waitFor(() => sut.getByTestId('form'))

    expect(localStorage.setItem)
      .toHaveBeenCalledWith('accessToken', authenticationSpy.account.accessToken)
  })

  test('Should go to sign up', () => {
    const { sut } = makeSut()

    const signup = sut.getByTestId('signup')
    fireEvent.click(signup)

    expect(history.length).toBe(2)
    expect(history.location.pathname).toBe('/signup')
  })
})
