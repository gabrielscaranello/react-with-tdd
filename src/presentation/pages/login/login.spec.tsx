import React from 'react'
import { faker } from '@faker-js/faker'

import { cleanup, fireEvent, render, RenderResult, waitFor } from '@testing-library/react'
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

const makeSut = (params?: SutParams): SutTypes => {
  const authenticationSpy = new AuthenticationSpy()
  const validationStub = new ValidationStub()
  validationStub.errorMessage = params?.errorMessage

  const sut = render(<Login validation={validationStub} authentication={authenticationSpy} />)
  return { sut, authenticationSpy }
}

const simulateValidSubmit = (sut: RenderResult, email?: string, password?: string): void => {
  populateEmailField(sut, email)
  populatePasswordField(sut, password)
  fireEvent.submit(sut.getByTestId('submit'))
}

const populateEmailField = (sut: RenderResult, email = faker.internet.email()): void => {
  fireEvent.input(sut.getByTestId('email'), { target: { value: email } })
}

const populatePasswordField = (sut: RenderResult, password = faker.internet.password()): void => {
  fireEvent.input(sut.getByTestId('password'), { target: { value: password } })
}

const testStatusForField = (sut: RenderResult, field: string, errorMessage?: string): void => {
  const fieldStatus = sut.getByTestId(`${field}-status`)
  expect(fieldStatus.title).toBe(errorMessage ?? 'Tudo certo!')
  expect(fieldStatus.className).toMatch(errorMessage ? /statusError/ : /statusSuccess/)
}

describe('Login Component', () => {
  afterEach(cleanup)

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
    populateEmailField(sut)

    testStatusForField(sut, 'email', errorMessage)
  })

  test('Should show password error if validation fails', () => {
    const errorMessage = faker.lorem.words()
    const { sut } = makeSut({ errorMessage })
    populatePasswordField(sut)

    testStatusForField(sut, 'password', errorMessage)
  })

  test('Should show valid email state if validation success', () => {
    const { sut } = makeSut()
    populateEmailField(sut)

    testStatusForField(sut, 'email')
  })

  test('Should show valid password state if validation success', () => {
    const { sut } = makeSut()
    populatePasswordField(sut)

    testStatusForField(sut, 'password')
  })

  test('Should enable submit button if form is valid', () => {
    const { sut } = makeSut()
    const submitButton = sut.getByTestId('submit') as HTMLButtonElement
    populateEmailField(sut)
    populatePasswordField(sut)

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
    populateEmailField(sut)

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
})
