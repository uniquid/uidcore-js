import { Request, Response } from '../types'
import { BLANK_RESULT, ERROR_METHOD_NOT_IMPLEMENTED, ERROR_NONE } from './../types'

export const NO_RESPONSE = null
export interface Test {
  scenario: string
  description: string
  request: Request
  response: Response | typeof NO_RESPONSE
}
const tests: Test[] = [
  // ECHO for imprinter
  {
    scenario: 'imprinted-only',
    description: 'ECHO for imprinter',
    request: {
      sender: 'mu1NE35VDZi8jFkKiPZmnmhK1FEAwiBbbU',
      body: {
        method: 31,
        params: 'abc',
        id: 1
      }
    },
    response: {
      sender: 'mgofddcZaSpuoDiYxgPRVaYNNjsXbKKCsL',
      body: {
        result: 'abc',
        error: ERROR_NONE,
        id: 1
      }
    }
  },

  // unimplemented method for imprinter
  {
    scenario: 'imprinted-only',
    description: 'imprinter asks for unimplemented method',
    request: {
      sender: 'mu1NE35VDZi8jFkKiPZmnmhK1FEAwiBbbU',
      body: {
        method: 11,
        params: 'abc',
        id: 2
      }
    },
    response: {
      sender: 'mgofddcZaSpuoDiYxgPRVaYNNjsXbKKCsL',
      body: {
        result: BLANK_RESULT,
        error: ERROR_METHOD_NOT_IMPLEMENTED,
        id: 2
      }
    }
  },

  // rejects ECHO for unknown
  {
    scenario: 'imprinted-only',
    description: 'rejects ECHO for unknown',
    request: {
      sender: 'XXX',
      body: {
        method: 31,
        params: 'abc',
        id: 3
      }
    },
    response: NO_RESPONSE
  },

  // rejects unimplemented method for unknown
  {
    scenario: 'imprinted-only',
    description: 'rejects unimplemented method for unknown',
    request: {
      sender: 'XXX',
      body: {
        method: 11,
        params: 'xyz',
        id: 4
      }
    },
    response: NO_RESPONSE
  }
]
export default tests
