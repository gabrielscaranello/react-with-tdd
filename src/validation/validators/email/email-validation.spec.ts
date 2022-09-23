import { InvalidFieldError } from '@/validation/errors'
import { EmailValidation } from '@/validation/validators'
import { faker } from '@faker-js/faker'

const makeSut = (fieldName: string = faker.database.column()): EmailValidation => {
  return new EmailValidation(fieldName)
}

describe('EmailValidation', () => {
  test('Should return error if email is invalid', () => {
    const fieldName = faker.database.column()
    const sut = makeSut(fieldName)
    const error = sut.validate(faker.lorem.words())
    expect(error).toEqual(new InvalidFieldError(fieldName))
  })

  test('Should return falsy if email is valid', () => {
    const sut = makeSut()
    const error = sut.validate(faker.internet.email())
    expect(error).toBeFalsy()
  })

  test('Should return falsy if email is empty', () => {
    const sut = makeSut()
    const error = sut.validate('')
    expect(error).toBeFalsy()
  })
})
