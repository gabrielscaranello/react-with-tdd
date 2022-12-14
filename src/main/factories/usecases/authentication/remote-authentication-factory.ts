import { RemoteAuthentication } from '@/data/usecases/authentication/remote-authentication'
import { Authentication } from '@/domain/usecases'
import { makeAxiosHttpClient } from '@/main/factories/http/axios-http-client-factory'
import { makeApiURLFactory } from '@/main/factories/http/api-url-factory'

export const makeRemoteAutentication = (): Authentication => {
  return new RemoteAuthentication(makeAxiosHttpClient(), makeApiURLFactory())
}
