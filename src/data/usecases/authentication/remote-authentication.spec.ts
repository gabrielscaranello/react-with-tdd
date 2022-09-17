
import { HttpPostClientSpy } from '../../test'
import { RemoteAuthentication } from './remote-authentication'

describe('RemoteAuthentication', () => {
  test('Should call HttpPostClient with corrent URL', async () => {
    const url = 'any_url'
    const httpPostClient = new HttpPostClientSpy()
    const sut = new RemoteAuthentication(httpPostClient, url)
    await sut.auth()
    expect(httpPostClient.url).toBe(url)
  })
})
