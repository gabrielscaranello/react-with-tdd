import React from 'react'
import { faker } from '@faker-js/faker'

import { cleanup, fireEvent, render, RenderResult } from '@testing-library/react'
import Login from './login'
import { AuthenticationSpy, ValidationStub } from '@/presentation/test'

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

describe('Login Component', () => {
  afterEach(cleanup)

  test('Should start with initial state', () => {
    const errorMessage = faker.lorem.words()
    const { sut } = makeSut({ errorMessage })

    const errorWrap = sut.getByTestId('error-wrap')
    expect(errorWrap.childElementCount).toBe(0)

    const submitButton = sut.getByTestId('submit') as HTMLButtonElement
    expect(submitButton.disabled).toBe(true)

    const emailStatus = sut.getByTestId('email-status')
    expect(emailStatus.title).toBe(errorMessage)
    expect(emailStatus.className).toMatch(/statusError/)

    const passwordStatus = sut.getByTestId('password-status')
    expect(passwordStatus.title).toBe(errorMessage)
    expect(passwordStatus.className).toMatch(/statusError/)
  })

  test('Should show e-mail error if validation fails', () => {
    const errorMessage = faker.lorem.words()
    const { sut } = makeSut({ errorMessage })
    const emailInput = sut.getByTestId('email')

    fireEvent.input(emailInput, { target: { value: faker.internet.email() } })

    const emailStatus = sut.getByTestId('email-status')
    expect(emailStatus.title).toEqual(errorMessage)
    expect(emailStatus.className).toMatch(/statusError/)
  })

  test('Should show password error if validation fails', () => {
    const errorMessage = faker.lorem.words()
    const { sut } = makeSut({ errorMessage })
    const passwordInput = sut.getByTestId('password')

    fireEvent.input(passwordInput, { target: { value: faker.internet.password() } })

    const passwordStatus = sut.getByTestId('password-status')
    expect(passwordStatus.title).toEqual(errorMessage)
    expect(passwordStatus.className).toMatch(/statusError/)
  })

  test('Should show valid email state if validation success', () => {
    const { sut } = makeSut()
    const emailInput = sut.getByTestId('email')

    fireEvent.input(emailInput, { target: { value: faker.internet.email() } })

    const emailStatus = sut.getByTestId('email-status')
    expect(emailStatus.title).toEqual('Tudo certo!')
    expect(emailStatus.className).toMatch(/statusSuccess/)
  })

  test('Should show valid password state if validation success', () => {
    const { sut } = makeSut()
    const passwordInput = sut.getByTestId('password')

    fireEvent.input(passwordInput, { target: { value: faker.internet.password() } })

    const passwordStatus = sut.getByTestId('password-status')
    expect(passwordStatus.title).toEqual('Tudo certo!')
    expect(passwordStatus.className).toMatch(/statusSuccess/)
  })

  test('Should enable submit button if form is valid', () => {
    const { sut } = makeSut()
    const emailInput = sut.getByTestId('email')
    const passwordInput = sut.getByTestId('password')
    const submitButton = sut.getByTestId('submit') as HTMLButtonElement

    fireEvent.input(emailInput, { target: { value: faker.internet.email() } })
    fireEvent.input(passwordInput, { target: { value: faker.internet.password() } })

    expect(submitButton.disabled).toBe(false)
  })

  test('Should show loading on submit', () => {
    const { sut } = makeSut()
    const emailInput = sut.getByTestId('email')
    const passwordInput = sut.getByTestId('password')
    const submitButton = sut.getByTestId('submit')

    fireEvent.input(emailInput, { target: { value: faker.internet.email() } })
    fireEvent.input(passwordInput, { target: { value: faker.internet.password() } })
    fireEvent.submit(submitButton)

    expect(sut.getByTestId('spinner')).toBeTruthy()
  })

  test('Should call authentication with correct values', () => {
    const { sut, authenticationSpy } = makeSut()
    const emailInput = sut.getByTestId('email')
    const passwordInput = sut.getByTestId('password')
    const submitButton = sut.getByTestId('submit')
    const email = faker.internet.email()
    const password = faker.internet.password()

    fireEvent.input(emailInput, { target: { value: email } })
    fireEvent.input(passwordInput, { target: { value: password } })
    fireEvent.submit(submitButton)

    expect(authenticationSpy.params).toEqual({ email, password })
  })
})
