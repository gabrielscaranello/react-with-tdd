import { RequiredFieldValidation } from '@/validation/validators'
import { RequiredFieldError } from '@/validation/errors'
import { faker } from '@faker-js/faker'

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation(faker.database.column())
}

describe('RequiredFieldValidation', () => {
  test('Should return error if field is empty', () => {
    const sut = makeSut()
    const error = sut.validate('')
    expect(error).toEqual(new RequiredFieldError())
  })

  test('Should return falsy if field is not empty', () => {
    const sut = makeSut()
    const error = sut.validate(faker.lorem.words())
    expect(error).toBeFalsy()
  })
})
