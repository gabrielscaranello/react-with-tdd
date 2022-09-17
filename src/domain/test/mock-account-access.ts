import { faker } from '@faker-js/faker'
import { AuthenticationParams } from '@/domain/usecases'
import { AccountAccessModel } from '../models'

export const mockAuthenticationParams = (): AuthenticationParams => ({
  email: faker.internet.email(),
  password: faker.internet.password()
})

export const mockAccountAccessModel = (): AccountAccessModel => ({
  accessToken: faker.datatype.uuid()
})
