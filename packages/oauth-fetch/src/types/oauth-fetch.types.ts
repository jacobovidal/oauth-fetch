import type { AbstractTokenProvider } from "../providers/abstract-token-provider.js";
import type { HttpContentType } from "./request.types.js";
import type { DPoPKeyPair } from "./dpop.types.js";

/**
 * Configuration for public (non-authenticated) resources
 */
export type OAuthFetchPublicResourceConfig = {
  /** Base URL for API requests (e.g., 'https://api.example.com') */
  baseUrl: string;
  /** Content type for requests (defaults to JSON if not specified) */
  contentType?: HttpContentType;
  /** Must be explicitly set to false for public resources */
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
  /** Whether the API requires authentication (defaults to true)
   * @default true
   */
  isProtected?: true;
  /** Provider responsible for fetching OAuth tokens */
  tokenProvider: AbstractTokenProvider;
  /** Required for DPoP authentication flow */
  dpopKeyPair?: DPoPKeyPair;
};

export type OAuthFetchConfig =
  | OAuthFetchPublicResourceConfig
  | OAuthFetchPrivateResourceConfig;

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
