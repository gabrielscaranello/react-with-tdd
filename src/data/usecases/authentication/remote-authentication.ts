import { HttpPostClient } from 'data/protocols/http'

export class RemoteAuthentication {
  constructor (
    private readonly httpPostClient: HttpPostClient,
    private readonly url: string
  ) {}

  async auth (): Promise<void> {
    await this.httpPostClient.post({ url: this.url })
    return await Promise.resolve()
  }
}
