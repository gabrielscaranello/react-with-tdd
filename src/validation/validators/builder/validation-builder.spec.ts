import { faker } from '@faker-js/faker'
import { EmailValidation, MinLengthValidation, RequiredFieldValidation } from '@/validation/validators'
import { ValidationBuilder as sut } from './validation-builder'

describe('ValidationBuilder', () => {
  test('Should return RequiredFieldValidation', () => {
    const fieldName = faker.database.column()
    const expected = [new RequiredFieldValidation(fieldName)]
    const validations = sut.field(fieldName).required().build()

    expect(validations).toEqual(expected)
  })

  test('Should return EmailValidation', () => {
    const fieldName = faker.database.column()
    const expected = [new EmailValidation(fieldName)]
    const validations = sut.field(fieldName).email().build()

    expect(validations).toEqual(expected)
  })

  test('Should return MinLengthValidation', () => {
    const fieldName = faker.database.column()
    const expected = [new MinLengthValidation(fieldName, 5)]
    const validations = sut.field(fieldName).minLength(5).build()

    expect(validations).toEqual(expected)
  })
})
