import axios from 'axios'
import { AxiosHttpClient } from './axios-http-client'
import { mockAxios, mockHttpResponse } from '@/infra/test'
import { mockHttpPostRequest } from '@/data/test'

jest.mock('axios')

type SutTypes = {
  sut: AxiosHttpClient
  mockedAxios: jest.Mocked<typeof axios>
}

const makeSut = (): SutTypes => {
  const sut = new AxiosHttpClient()
  const mockedAxios = mockAxios()

  return { sut, mockedAxios }
}

describe('AxiosHttpClient', () => {
  test('should call axios with correct values', async () => {
    const request = mockHttpPostRequest()
    const { sut, mockedAxios } = makeSut()
    await sut.post(request)

    expect(mockedAxios.post).toHaveBeenCalledWith(request.url, request.body)
  })

  test('should return the correct status code and body', () => {
    const { sut, mockedAxios } = makeSut()
    const promise = sut.post(mockHttpPostRequest())

    expect(promise).toEqual(mockedAxios.post.mock.results[0].value)
  })

  test('should return the correct status code and body on failure', () => {
    const { sut, mockedAxios } = makeSut()
    mockedAxios.post.mockRejectedValueOnce({ response: mockHttpResponse() })
    const promise = sut.post(mockHttpPostRequest())

    expect(promise).toEqual(mockedAxios.post.mock.results[0].value)
  })
})
