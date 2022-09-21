import React from 'react'
import { cleanup, fireEvent, render, RenderResult } from '@testing-library/react'
import Login from './login'
import { ValidationStub } from '@/presentation/test'
import { faker } from '@faker-js/faker'

type SutTypes = {
  sut: RenderResult
  validationStub: ValidationStub
}

const makeSut = (): SutTypes => {
  const validationStub = new ValidationStub()
  validationStub.errorMessage = faker.lorem.words()

  const sut = render(<Login validation={validationStub} />)
  return { sut, validationStub }
}

describe('Login Component', () => {
  afterEach(cleanup)

  test('Should start with initial state', () => {
    const { sut, validationStub } = makeSut()
    const errorWrap = sut.getByTestId('error-wrap')
    expect(errorWrap.childElementCount).toBe(0)

    const submitButton = sut.getByTestId('submit') as HTMLButtonElement
    expect(submitButton.disabled).toBe(true)

    const emailStatus = sut.getByTestId('email-status')
    expect(emailStatus.title).toBe(validationStub.errorMessage)
    expect(emailStatus.className).toMatch(/statusError/)

    const passwordStatus = sut.getByTestId('password-status')
    expect(passwordStatus.title).toBe(validationStub.errorMessage)
    expect(passwordStatus.className).toMatch(/statusError/)
  })

  test('Should show e-mail error if validation fails', () => {
    const { sut, validationStub } = makeSut()
    const emailInput = sut.getByTestId('email')
    const errorMessage = faker.lorem.words()
    validationStub.errorMessage = errorMessage

    fireEvent.input(emailInput, { target: { value: faker.internet.email() } })

    const emailStatus = sut.getByTestId('email-status')
    expect(emailStatus.title).toEqual(errorMessage)
    expect(emailStatus.className).toMatch(/statusError/)
  })

  test('Should show password error if validation fails', () => {
    const { sut, validationStub } = makeSut()
    const passwordInput = sut.getByTestId('password')
    const errorMessage = faker.lorem.words()
    validationStub.errorMessage = errorMessage

    fireEvent.input(passwordInput, { target: { value: faker.internet.password() } })

    const passwordStatus = sut.getByTestId('password-status')
    expect(passwordStatus.title).toEqual(errorMessage)
    expect(passwordStatus.className).toMatch(/statusError/)
  })

  test('Should show valid email state if validation success', () => {
    const { sut, validationStub } = makeSut()
    const emailInput = sut.getByTestId('email')
    const errorMessage = null
    validationStub.errorMessage = errorMessage

    fireEvent.input(emailInput, { target: { value: faker.internet.email() } })

    const emailStatus = sut.getByTestId('email-status')
    expect(emailStatus.title).toEqual('Tudo certo!')
    expect(emailStatus.className).toMatch(/statusSuccess/)
  })

  test('Should show valid password state if validation success', () => {
    const { sut, validationStub } = makeSut()
    const passwordInput = sut.getByTestId('password')
    const errorMessage = null
    validationStub.errorMessage = errorMessage

    fireEvent.input(passwordInput, { target: { value: faker.internet.password() } })

    const passwordStatus = sut.getByTestId('password-status')
    expect(passwordStatus.title).toEqual('Tudo certo!')
    expect(passwordStatus.className).toMatch(/statusSuccess/)
  })

  test('Should enable submit button if form is valid', () => {
    const { sut, validationStub } = makeSut()
    const emailInput = sut.getByTestId('email')
    const passwordInput = sut.getByTestId('password')
    const submitButton = sut.getByTestId('submit') as HTMLButtonElement
    const errorMessage = null
    validationStub.errorMessage = errorMessage

    fireEvent.input(emailInput, { target: { value: faker.internet.email() } })
    fireEvent.input(passwordInput, { target: { value: faker.internet.password() } })

    expect(submitButton.disabled).toBe(false)
  })
})
