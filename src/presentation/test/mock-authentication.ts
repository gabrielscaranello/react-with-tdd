import { AccountAccessModel } from '@/domain/models'
import { mockAccountAccessModel } from '@/domain/test'
import { Authentication, AuthenticationParams } from '@/domain/usecases'

export class AuthenticationSpy implements Authentication {
  params: AuthenticationParams
  account: AccountAccessModel = mockAccountAccessModel()
  callsCount = 0

  async auth (params: AuthenticationParams): Promise<AccountAccessModel> {
    this.callsCount = 1
    this.params = params
    return this.account
  }
}
