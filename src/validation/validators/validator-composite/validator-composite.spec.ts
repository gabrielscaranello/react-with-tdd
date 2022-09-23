
import { faker } from '@faker-js/faker'

import { ValidationComposite } from './validator-composite'
import { FieldValidationSpy } from '@/validation/test'

type SutTypes = {
  sut: ValidationComposite
  fieldValidationsSpy: FieldValidationSpy[]
}

const makeSut = (fieldName: string): SutTypes => {
  const fieldValidationsSpy = [
    new FieldValidationSpy(fieldName),
    new FieldValidationSpy(fieldName)
  ]
  const sut = ValidationComposite.build(fieldValidationsSpy)
  return { sut, fieldValidationsSpy }
}

describe('ValidationComposite', () => {
  test('Should return error if any validation fails', () => {
    const fieldName = faker.database.column()
    const { sut, fieldValidationsSpy } = makeSut(fieldName)
    const errorMsg = faker.lorem.words()
    fieldValidationsSpy[0].error = new Error(errorMsg)
    fieldValidationsSpy[1].error = new Error(faker.lorem.words())
    const result = sut.validate(fieldName, faker.lorem.words())
    expect(result).toBe(errorMsg)
  })

  test('Should return falsy if all validation succeeds', () => {
    const fieldName = faker.database.column()
    const { sut } = makeSut(fieldName)
    const result = sut.validate(fieldName, faker.lorem.words())
    expect(result).toBeFalsy()
  })
})
