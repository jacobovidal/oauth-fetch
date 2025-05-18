import type { TokenProviderGetTokenResponse } from "../types/token-provider.types.js";

/**
 * Abstract class representing a Token Provider responsible for managing the
 * lifecycle of access tokens.
 *
 * This class defines the contract for acquiring, refreshing, and caching tokens.
 * By extending this class, you can implement custom strategies for interacting with identity
 * providers such as Auth0, Clerk, WorkOS, or any other OAuth-compliant service.
 *
 * It also provides a mechanism to override the configuration for token
 * acquisition per request, enabling granular control over authorization
 * parameters.
 *
 * @example
 * ```typescript
 * import { AbstractTokenProvider, type TokenProviderGetTokenResponse } from "oauth-fetch";
 * import { Auth0Client, GetTokenSilentlyOptions } from "@auth0/auth0-spa-js";
 *
 * export class Auth0TokenProvider extends AbstractTokenProvider<GetTokenSilentlyOptions> {
 *   private auth0: Auth0Client;
 *
 *   constructor(auth0: Auth0Client, config?: GetTokenSilentlyOptions) {
 *     super(config);
 *     this.auth0 = auth0;
 *   }
 *
 *   async getToken(): Promise<TokenProviderGetTokenResponse> {
 *     try {
 *       const accessToken = await this.auth0.getTokenSilently(this.config);
 *       return {
 *         access_token: accessToken,
 *         token_type: "Bearer",
 *       };
 *     } catch {
 *       throw new Error("Failed to retrieve access token.");
 *     }
 *   }
 * }
 * ```
 */
export abstract class AbstractTokenProvider<
  TokenProviderGetTokenConfig = unknown,
> {
  /**
   * Allows any property to be dynamically attached to the instance.
   */
  [key: string]: unknown;

  /**
   * Configuration for the token provider's `getToken()` method.
   * This can include options for token acquisition, caching, and other settings
   * that the provider supports.
   */
  protected config?: TokenProviderGetTokenConfig;

  /**
   * Initializes a new instance of the `AbstractTokenProvider`.
   */
  constructor(config?: TokenProviderGetTokenConfig) {
    this.config = config;
  }

  /**
   * Retrieves a valid OAuth access token for API requests.
   *
   * This method should be responsible for the entire token lifecycle management:
   * - Returning cached tokens if they're still valid
   * - Refreshing expired tokens automatically when possible
   * - Handling token acquisition when no valid token is available
   * - Implementing appropriate error handling for token-related failures
   *
   * Implementations should be designed to minimize overhead by efficiently
   * caching tokens and only performing network requests when necessary.
   *
   * @throws {TokenProviderError} if a valid token cannot be obtained.
   */
  abstract getToken(): Promise<TokenProviderGetTokenResponse>;

  /**
   * Creates a new instance of the token provider with overridden `getToken` config.
   *
   * This method allows you to generate a modified instance of the token provider
   * with specific configuration changes. Only the matching properties are overridden,
   * while the rest of the configuration remains unchanged. This is ideal for fine-tuning
   * authorization scopes or parameters on a per-request basis without affecting the
   * original instance.
   *
   * @example
   * ```typescript
   * const newTokenProvider = tokenProvider.withConfigOverrides({
   *   authorizationParams: {
   *     scope: "write:profile",
   *   },
   * });
   * ```
   */
  withConfigOverrides(overrides: Partial<TokenProviderGetTokenConfig>): this {
    const ProviderConstructor = this.constructor as new (
      config: TokenProviderGetTokenConfig,
    ) => this;

    const mergedConfig = {
      ...this.config,
      ...overrides,
    } as TokenProviderGetTokenConfig;

    return new ProviderConstructor(mergedConfig);
  }
}
