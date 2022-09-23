import { faker } from '@faker-js/faker'
import { RequiredFieldValidation } from '@/validation/validators'
import { ValidationBuilder as sut } from './validation-builder'

describe('ValidationBuilder', () => {
  test('Should return RequiredFieldValidation', () => {
    const fieldName = faker.database.column()
    const expected = [new RequiredFieldValidation(fieldName)]
    const validations = sut.field(fieldName).required().build()

    expect(validations).toEqual(expected)
  })
})
