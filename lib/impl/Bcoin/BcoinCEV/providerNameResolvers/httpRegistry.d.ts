import { ProviderNameResolver } from '../CtrManager';
/**
 * An implementation of {@link ProviderNameResolver} which queries a UQ Registry HTTP service
 * for a provider name agains its ${IdAddress}
 *
 * @param {string} baseUrl the base Url of the Regisry service
 * @returns {ProviderNameResolver}
 */
export declare const fromHTTPRegistry: (baseUrl: string) => ProviderNameResolver;
