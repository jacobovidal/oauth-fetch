import { TokenProviderGetTokenResponse } from "../types/token-provider.types.js";

export abstract class AbstractTokenProvider<
  TokenProviderGetTokenConfig = unknown
> {
  // Allow any property to be dynamically attached to the instance
  [key: string]: unknown;
  /**
   * Configuration for the token provider getToken() method.
   * This can include options for token acquisition, caching, and other settings that the provider supports.
   */
  protected config?: TokenProviderGetTokenConfig;

  constructor(config?: TokenProviderGetTokenConfig) {
    this.config = config;
  }

  /**
   * Retrieves a valid OAuth access token for API requests.
   *
   * This method is responsible for the entire token lifecycle management:
   * - Returning cached tokens if they're still valid
   * - Refreshing expired tokens automatically when possible
   * - Handling token acquisition when no valid token is available
   * - Implementing appropriate error handling for token-related failures
   *
   * Implementations should be designed to minimize overhead by efficiently
   * caching tokens and only performing network requests when necessary.
   *
   * @throws {Error} if a valid token cannot be obtained
   *
   * @example
   * ```typescript
   * import {
   *   type Auth0Client,
   *   type GetTokenSilentlyOptions,
   * } from "@auth0/auth0-spa-js";
   * import {
   *   AbstractTokenProvider,
   *   type TokenProviderGetTokenResponse,
   * } from "oauth-fetch";
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
   *
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
  abstract getToken(): Promise<TokenProviderGetTokenResponse>;

  /**
   * Creates a new instance with overridden `getToken` config.
   *
   * This method allows you to generate a modified instance of the token provider
   * with specific configuration changes. Only the matching properties are overridden,
   * while the rest of the configuration remains unchanged. This is ideal for fine-tuning
   * authorization scopes or parameters on a per-request basis without affecting the original instance.
   *
   * @example
   * ```typescript
   * import { Auth0Client } from "@auth0/auth0-spa-js";
   * import { OAuthFetch } from "oauth-fetch";
   * 
   * import { Auth0TokenProvider } from "./auth0-token-provider.js";
   *
   * // Instantiate your Auth0 client
   * const auth0 = new Auth0Client({
   *   domain: "auth0.oauthlabs.com",
   *   clientId: "UapVm2tv...",
   *   authorizationParams: {
   *     redirect_uri: window.location.origin,
   *   },
   * });
   *
   * // Define the base configuration for the Token Provider
   * const config = {
   *   authorizationParams: {
   *     scope: "openid email read:profile",
   *     audience: "https://api.example.com",
   *   },
   * };
   *
   * // Create an instance of Auth0TokenProvider
   * const tokenProvider = new Auth0TokenProvider(auth0, config);
   *
   * // Initialize the OAuthFetch client with the base Token Provider
   * const oauthClient = new OAuthFetch({
   *   baseUrl: "https://api.example.com",
   *   tokenProvider,
   * });
   *
   * // Make a PATCH request with a body passing `authorizationParams.scope` for just this call
   * await oauthClient.patch(
   *   "/me/profile",
   *   {
   *     first_name: "Jacobo",
   *     company_name: "Auth0",
   *   },
   *   {
   *     tokenProvider: tokenProvider.withConfigOverrides({
   *       authorizationParams: {
   *         scope: "write:profile",
   *       },
   *     }),
   *   }
   * );
   */
  withConfigOverrides(overrides: Partial<TokenProviderGetTokenConfig>): this {
    const ProviderConstructor = this.constructor as new (
      config: TokenProviderGetTokenConfig
    ) => this;

    const mergedConfig = {
      ...this.config,
      ...overrides,
    } as TokenProviderGetTokenConfig;

    return new ProviderConstructor(mergedConfig);
  }
}
