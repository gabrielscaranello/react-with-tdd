import { FieldValidation } from '@/validation/protocols'

export class FieldValidationSpy implements FieldValidation {
  constructor (readonly fieldName: string, public error: Error = null) {}

  validate (value: string): Error {
    return this.error
  }
}
