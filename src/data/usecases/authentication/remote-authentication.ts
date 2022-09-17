import { HttpPostClient } from 'data/protocols/http'
import { AuthenticationParams } from 'domain/usecases'

export class RemoteAuthentication {
  constructor (
    private readonly httpPostClient: HttpPostClient,
    private readonly url: string
  ) {}

  async auth (params: AuthenticationParams): Promise<void> {
    await this.httpPostClient.post({ url: this.url, body: params })
    return await Promise.resolve()
  }
}
