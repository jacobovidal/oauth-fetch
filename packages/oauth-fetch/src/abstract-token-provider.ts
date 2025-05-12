import { TokenType } from "./oauth-fetch.js";

/**
 * Represents the response from a token acquisition operation.
 * Contains the access token and its type for use in API requests.
 */
export interface TokenResponse {
  /**
   * The OAuth access token value used for API authorization.
   * This token should be included in the Authorization header of API requests.
   */
  access_token: string;

  /**
   * The type of token returned, which determines how it should be used in requests.
   * Common types include "Bearer" and "DPoP" (Demonstrating Proof-of-Possession).
   */
  token_type: TokenType;
}

export abstract class AbstractTokenProvider {
  // Allow any property to be dynamically attached to the instance
  [key: string]: unknown;

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
   * import { Auth0Client } from "@auth0/auth0-spa-js";
   * import {
   *   AbstractTokenProvider,
   *   TokenResponse,
   * } from "../abstract-token-provider.js";
   *
   * export class Auth0TokenProvider extends AbstractTokenProvider {
   *   private auth0: Auth0Client;
   *
   *   constructor(auth0: Auth0Client) {
   *     super();
   *     this.auth0 = auth0;
   *   }
   *
   *   async getToken(options?: Record<string, unknown>): Promise<TokenResponse> {
   *     try {
   *       const accessToken = await this.auth0.getTokenSilently(options);
   *
   *       return {
   *         access_token: accessToken,
   *         token_type: "Bearer",
   *       };
   *     } catch (error) {
   *       console.error("Failed to retrieve token", error);
   *       throw new Error("Failed to retrieve token");
   *     }
   *   }
   * }
   * ```
   */
  abstract getToken(options?: Record<string, unknown>): Promise<TokenResponse>;
}
