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
    const length = faker.datatype.number({ max: 255 })
    const expected = [new MinLengthValidation(fieldName, length)]
    const validations = sut.field(fieldName).min(length).build()
    expect(validations).toEqual(expected)
  })

  test('Should return a list of validations ', () => {
    const fieldName = faker.database.column()
    const length = faker.datatype.number({ max: 255 })
    const expected = [
      new RequiredFieldValidation(fieldName),
      new MinLengthValidation(fieldName, length),
      new EmailValidation(fieldName)
    ]
    const validations = sut.field(fieldName).required().min(length).email().build()
    expect(validations).toEqual(expected)
  })
})
