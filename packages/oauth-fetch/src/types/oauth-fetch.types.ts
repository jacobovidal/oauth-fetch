import { AbstractTokenProvider } from "src/providers/abstract-token-provider.js";
import { HttpContentType, HttpMethod } from "./request.types.js";
import { DPoPKeyPair } from "./dpop.types.js";

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
  /** Content type for requests (defaults to JSON if not specified) */
  contentType?: HttpContentType;
  /** Whether the API requires authentication (defaults to true) */
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
 * @internal
 * Configuration for building request headers
 */
export type RequestHeadersConfig = {
  /** Complete URL for the request including base URL and endpoint path */
  url: URL;
  /** HTTP method for the request */
  method: HttpMethod;
  /** Additional headers to include with the request */
  extraHeaders?: RequestInit["headers"];
  /** Token provider that can be overridden per request */
  tokenProvider?: AbstractTokenProvider;
  /** Optional configuration object for getToken method */
  getTokenConfig?: Record<string, unknown>;
  /** Whether this specific request requires authentication */
  isProtected?: boolean;
  /** Content type for the request body and headers */
  contentType: HttpContentType;
  /** DPoP nonce for replay protection */
  nonce?: string;
  /** Cryptographic key pair for DPoP proof generation */
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
  /** Granular configuration object for getToken method */
  getTokenConfig?: Record<string, unknown>;
  /** Override the default protection setting for this specific request */
  isProtected?: boolean;
};

export type RequestBody = Record<string, unknown> | string;

/**
 * @internal
 * Options for making HTTP requests
 */
export type ExecuteRequestOptions = RequestOptions & {
  /** API endpoint path (relative to baseUrl) */
  endpoint: string;
  /** HTTP method (GET, POST, PUT, PATCH, DELETE) */
  method: HttpMethod;
  /** Additional headers to include with the request */
  extraHeaders?: RequestInit["headers"];
  /** Request body data */
  body?: RequestBody;
};
