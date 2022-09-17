
import { faker } from '@faker-js/faker'
import { mockAuthenticationParams } from '../../../domain/test'
import { HttpPostClientSpy } from '../../test'
import { RemoteAuthentication } from './remote-authentication'

type SutTypes = {
  sut: RemoteAuthentication
  httpPostClientSpy: HttpPostClientSpy
}

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpPostClientSpy = new HttpPostClientSpy()
  const sut = new RemoteAuthentication(httpPostClientSpy, url)

  return { sut, httpPostClientSpy }
}

describe('RemoteAuthentication', () => {
  test('Should call HttpPostClient with corrent URL', async () => {
    const url = faker.internet.url()
    const { httpPostClientSpy, sut } = makeSut(url)
    await sut.auth(mockAuthenticationParams())
    expect(httpPostClientSpy.url).toBe(url)
  })

  test('Should call HttpPostClient with corrent body', async () => {
    const { httpPostClientSpy, sut } = makeSut()
    const authenticationParams = mockAuthenticationParams()

    await sut.auth(authenticationParams)
    expect(httpPostClientSpy.body).toEqual(authenticationParams)
  })
})
