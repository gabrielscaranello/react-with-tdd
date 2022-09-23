
import { faker } from '@faker-js/faker'

import { ValidationComposite } from './validator-composite'
import { FieldValidationSpy } from '@/validation/test'

type SutTypes = {
  sut: ValidationComposite
  fieldValidationsSpy: FieldValidationSpy[]
}

const makeSut = (): SutTypes => {
  const fieldValidationsSpy = [
    new FieldValidationSpy('any_field'),
    new FieldValidationSpy('any_field')
  ]
  const sut = new ValidationComposite(...fieldValidationsSpy)

  return { sut, fieldValidationsSpy }
}

describe('ValidationComposite', () => {
  test('Should return error if any validation fails', () => {
    const { sut, fieldValidationsSpy } = makeSut()
    fieldValidationsSpy[0].error = new Error('first_msg_error')
    fieldValidationsSpy[1].error = new Error('second_msg_error')
    const result = sut.validate('any_field', faker.lorem.words())
    expect(result).toBe('first_msg_error')
  })
})
