import type { AbstractTokenProvider } from "../providers/abstract-token-provider.js";
import type { HttpContentType } from "./request.types.js";
import type { DPoPKeyPair } from "./dpop.types.js";

/**
 * Configuration for public (non-authenticated) resources
 */
export type OAuthFetchPublicResourceConfig = {
  /** Base URL for API requests (e.g., 'https://api.example.com') */
  baseUrl: string;
  /**
   * Content type for requests (defaults to JSON if not specified)
   * @default "json"
   */
  contentType?: HttpContentType;
  /**
   * Custom fetch implementation
   *
   * @example
   * // Example using a custom fetch implementation
   * const client = new OAuthFetch({
   *   baseUrl: 'https://api.example.com',
   *   isProtected: false,
   *   customFetch: async (url, options) => {
   *     // Custom fetch logic
   *   }
   * });
   */
  customFetch?: typeof fetch;
  /** Whether the API requires authentication (defaults to true)
   * @default true
   */
  isProtected: false;
};

/**
 * Configuration for protected (authenticated) resources
 */
export type OAuthFetchPrivateResourceConfig = {
  /** Base URL for API requests (e.g., 'https://api.example.com') */
  baseUrl: string;
  /**
   * Content type for requests (defaults to JSON if not specified)
   * @default "json"
   */
  contentType?: HttpContentType;
  /**
   * Custom fetch implementation
   *
   * @example
   * // Example using a custom fetch implementation
   * const client = new OAuthFetch({
   *   baseUrl: 'https://api.example.com',
   *   isProtected: false,
   *   customFetch: async (url, options) => {
   *     // Custom fetch logic
   *   }
   * });
   */
  customFetch?: typeof fetch;
  /** Whether the API requires authentication (defaults to true)
   * @default true
   */
  isProtected?: true;
  /** Provider responsible for fetching OAuth tokens */
  tokenProvider: AbstractTokenProvider;
  /** Required for DPoP authentication flow */
  dpopKeyPair?: DPoPKeyPair;
};

/**
 * Extended request options that support authentication overrides and all standard fetch options
 */
export type RequestOptions = Omit<
  RequestInit,
  "method" | "body" | "headers"
> & {
  /** Additional headers to be included with the request */
  extraHeaders?: RequestInit["headers"];
  /** Override the default protection setting for this specific request */
  isProtected?: boolean;
  /** Override the default provider responsible for fetching OAuth tokens */
  tokenProvider?: AbstractTokenProvider;
};

export type RequestBody = Record<string, unknown> | string;
