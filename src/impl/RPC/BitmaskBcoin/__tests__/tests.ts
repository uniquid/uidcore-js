import { Request, Response } from '../types'
import { ERROR_NOT_ALLOWED, ERROR_NOT_IMPLEMENTED } from './../RPC'

export interface Test<Nonce extends string> {
  scenario: string
  description: string
  request: Request<Nonce>
  response: Response<Nonce>
}

const tests: Test<string>[] = [
  // ECHO for imprinter
  {
    scenario: 'imprinted-only',
    description: 'ECHO for imprinter',
    request: {
      sender: 'mu1NE35VDZi8jFkKiPZmnmhK1FEAwiBbbU',
      body: {
        method: 31,
        params: 'abc',
        id: 'echo4imprinter',
      },
    },
    response: {
      sender: 'mgofddcZaSpuoDiYxgPRVaYNNjsXbKKCsL',
      body: {
        result: 'abc',
        error: '',
        id: 'echo4imprinter',
      },
    },
  } as Test<'echo4imprinter'>,

  // unimplemented method for imprinter
  {
    scenario: 'imprinted-only',
    description: 'imprinter asks for unimplemented method',
    request: {
      sender: 'mu1NE35VDZi8jFkKiPZmnmhK1FEAwiBbbU',
      body: {
        method: 11,
        params: 'abc',
        id: 'unimplementedMethod4imprinter',
      },
    },
    response: {
      sender: 'mgofddcZaSpuoDiYxgPRVaYNNjsXbKKCsL',
      body: {
        result: '',
        error: ERROR_NOT_IMPLEMENTED,
        id: 'unimplementedMethod4imprinter',
      },
    },
  } as Test<'unimplementedMethod4imprinter'>,

  // rejects ECHO for unknown
  {
    scenario: 'imprinted-only',
    description: 'rejects ECHO for unknown',
    request: {
      sender: 'XXX',
      body: {
        method: 31,
        params: 'abc',
        id: 'reject echo',
      },
    },
    response: {
      sender: '',
      body: {
        result: '',
        error: ERROR_NOT_ALLOWED,
        id: 'reject echo',
      },
    },
  } as Test<'reject echo'>,

  // rejects unimplemented method for unknown
  {
    scenario: 'imprinted-only',
    description: 'rejects unimplemented method for unknown',
    request: {
      sender: 'XXX',
      body: {
        method: 11,
        params: 'xyz',
        id: 'reject echo',
      },
    },
    response: {
      sender: '',
      body: {
        result: '',
        error: ERROR_NOT_ALLOWED,
        id: 'reject echo',
      },
    },
  } as Test<'reject echo'>,
]
export default tests
