export type IdAddress = string
export const PROVIDER = 'PROVIDER'
export const USER = 'USER'
export type Role = typeof USER | typeof PROVIDER
export interface AbstractIdentity {
  role: Role
  index: number
}
export interface BaseIdentity extends AbstractIdentity {
  address: IdAddress
}
export interface UserIdentity extends BaseIdentity {
  role: typeof USER
}
export interface ProviderIdentity extends BaseIdentity {
  role: typeof PROVIDER
}
export type Identity = UserIdentity | ProviderIdentity

export interface IdentityOf {
  [PROVIDER]: ProviderIdentity
  [USER]: UserIdentity
}
