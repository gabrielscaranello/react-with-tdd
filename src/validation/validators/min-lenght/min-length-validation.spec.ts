import { InvalidFieldError } from '@/validation/errors'
import { MinLengthValidation } from '@/validation/validators'
import { faker } from '@faker-js/faker'

const makeSut = (fieldName: string = faker.database.column()): MinLengthValidation => {
  return new MinLengthValidation(fieldName, 5)
}

describe('MinLengthValidation', () => {
  test('should return error if value is invalid', () => {
    const fieldName = faker.database.column()
    const sut = makeSut(fieldName)
    const error = sut.validate(faker.lorem.word(3))
    expect(error).toEqual(new InvalidFieldError(fieldName))
  })

  test('should return falsy if value is valid', () => {
    const sut = makeSut()
    const error = sut.validate(faker.lorem.word(5))
    expect(error).toBeFalsy()
  })
})
