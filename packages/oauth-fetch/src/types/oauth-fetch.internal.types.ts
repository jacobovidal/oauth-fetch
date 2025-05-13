import { AbstractTokenProvider } from "../providers/abstract-token-provider.js";
import { HttpContentType, HttpMethod } from "./request.types.js";
import { DPoPKeyPair } from "./dpop.types.js";
import { RequestOptions, RequestBody } from "./oauth-fetch.types.js";

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
