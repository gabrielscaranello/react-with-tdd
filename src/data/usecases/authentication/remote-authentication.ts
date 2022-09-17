import { HttpPostClient, HttpStatusCode } from '@/data/protocols/http'
import { InvalidCredentialsError, UnexpectedError } from '@/domain/errors'
import { AccountAccessModel } from '@/domain/models'
import { Authentication, AuthenticationParams } from '@/domain/usecases'

export class RemoteAuthentication implements Authentication {
  constructor (
    private readonly httpPostClient: HttpPostClient<AuthenticationParams, AccountAccessModel>,
    private readonly url: string
  ) {}

  async auth (params: AuthenticationParams): Promise<AccountAccessModel> {
    const httpResponse = await this.httpPostClient.post({ url: this.url, body: params })

    switch (httpResponse.statusCode) {
      case HttpStatusCode.success: return httpResponse.body
      case HttpStatusCode.unauthorized: throw new InvalidCredentialsError()
      default: throw new UnexpectedError()
    }
  }
}
