import { faker } from '@faker-js/faker'
import { fireEvent, render, RenderResult } from '@testing-library/react'
import React from 'react'

import Input from './input'
import { FormContext } from '@/presentation/contexts'

const makeSut = (fieldName: string = faker.database.column()): RenderResult => {
  return render(
    <FormContext.Provider value={{ state: {} }}>
      <Input name={fieldName} />
    </FormContext.Provider>
  )
}

describe('Input Component', () => {
  test('should loads with readOnly', () => {
    const fieldName = faker.database.column()
    const sut = makeSut(fieldName)
    const input = sut.getByTestId(fieldName) as HTMLInputElement
    expect(input.readOnly).toBe(true)
  })

  test('should remove readOnly on focus', () => {
    const fieldName = faker.database.column()
    const sut = makeSut(fieldName)
    const input = sut.getByTestId(fieldName) as HTMLInputElement
    fireEvent.focus(input)
    expect(input.readOnly).toBe(false)
  })
})
