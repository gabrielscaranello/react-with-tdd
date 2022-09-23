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
const history = createMemoryHistory({ initialEntries: ['/login'] })
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

const simulateValidSubmit = async (sut: RenderResult, email?: string, password?: string): Promise<void> => {
  populateFormField(sut, 'email', email)
  populateFormField(sut, 'password', password)
  const form = sut.getByTestId('submit')
  fireEvent.submit(form)
  await waitFor(() => form)
}

const populateFormField = (sut: RenderResult, field: string, value = faker.lorem.words()): void => {
  fireEvent.input(sut.getByTestId(field), { target: { value } })
}

const testStatusForField = (sut: RenderResult, field: string, errorMessage?: string): void => {
  const fieldStatus = sut.getByTestId(`${field}-status`)
  expect(fieldStatus.title).toBe(errorMessage ?? 'Tudo certo!')
  expect(fieldStatus.className).toMatch(errorMessage ? /statusError/ : /statusSuccess/)
}

const testErrorWrapChildCount = (sut: RenderResult, count: number): void => {
  const errorWrap = sut.getByTestId('error-wrap')
  expect(errorWrap.childElementCount).toBe(count)
}

const testElementExists = (sut: RenderResult, fieldName: string): void => {
  expect(sut.getByTestId(fieldName)).toBeTruthy()
}

const testElementText = (sut: RenderResult, fieldName: string, text: string): void => {
  const el = sut.getByTestId('main-error')
  expect(el.textContent).toBe(text)
}

const testButtonIsDisabled = (sut: RenderResult, fieldName: string, isDisabled: boolean = true): void => {
  const button = sut.getByTestId(fieldName) as HTMLButtonElement
  expect(button.disabled).toBe(isDisabled)
}

describe('Login Component', () => {
  afterEach(cleanup)
  beforeEach(() => { localStorage.clear() })

  test('should start with initial state', () => {
    const errorMessage = faker.lorem.words()
    const { sut } = makeSut({ errorMessage })
    testButtonIsDisabled(sut, 'submit')
    testErrorWrapChildCount(sut, 0)
    testStatusForField(sut, 'email', errorMessage)
    testStatusForField(sut, 'password', errorMessage)
  })

  test('should show e-mail error if validation fails', () => {
    const errorMessage = faker.lorem.words()
    const { sut } = makeSut({ errorMessage })
    populateFormField(sut, 'email')
    testStatusForField(sut, 'email', errorMessage)
  })

  test('should show password error if validation fails', () => {
    const errorMessage = faker.lorem.words()
    const { sut } = makeSut({ errorMessage })
    populateFormField(sut, 'password')
    testStatusForField(sut, 'password', errorMessage)
  })

  test('should show valid email state if validation success', () => {
    const { sut } = makeSut()
    populateFormField(sut, 'email')
    testStatusForField(sut, 'email')
  })

  test('should show valid password state if validation success', () => {
    const { sut } = makeSut()
    populateFormField(sut, 'password')
    testStatusForField(sut, 'password')
  })

  test('should enable submit button if form is valid', () => {
    const { sut } = makeSut()
    populateFormField(sut, 'email')
    populateFormField(sut, 'password')
    testButtonIsDisabled(sut, 'submit', false)
  })

  test('should show loading on submit', async () => {
    const { sut } = makeSut()
    await simulateValidSubmit(sut)
    testElementExists(sut, 'spinner')
  })

  test('should call authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut()
    const email = faker.internet.email()
    const password = faker.internet.password()
    await simulateValidSubmit(sut, email, password)
    expect(authenticationSpy.params).toEqual({ email, password })
  })

  test('should call authentication only once', async () => {
    const { sut, authenticationSpy } = makeSut()
    await simulateValidSubmit(sut)
    await simulateValidSubmit(sut)
    expect(authenticationSpy.callsCount).toBe(1)
  })

  test('should not call authentication if form is invalid', async () => {
    const errorMessage = faker.lorem.words()
    const { sut, authenticationSpy } = makeSut({ errorMessage })
    await simulateValidSubmit(sut)
    expect(authenticationSpy.callsCount).toBe(0)
  })

  test('should present error if Authentication fails', async () => {
    const { sut, authenticationSpy } = makeSut()
    const error = new InvalidCredentialsError()
    jest.spyOn(authenticationSpy, 'auth')
      .mockImplementationOnce(() => { throw error })

    await simulateValidSubmit(sut)
    testErrorWrapChildCount(sut, 1)
    testElementText(sut, 'error-wrap', error.message)
  })

  test('should add access token to localstorage on success', async () => {
    const { sut, authenticationSpy } = makeSut()
    await simulateValidSubmit(sut)

    expect(localStorage.setItem)
      .toHaveBeenCalledWith('accessToken', authenticationSpy.account.accessToken)

    expect(history.length).toBe(1)
    expect(history.location.pathname).toBe('/')
  })

  test('should go to sign up', () => {
    const { sut } = makeSut()
    const signup = sut.getByTestId('signup')

    fireEvent.click(signup)

    expect(history.length).toBe(2)
    expect(history.location.pathname).toBe('/signup')
  })
})
