import { AbstractTokenProvider } from "./abstract-token-provider.js";
import { DPoPUtils } from "./utils/dpop-utils.js";
import { formatRequestBody, parseResponseBody } from "./utils/request-utils.js";

/**
 * HTTP content type constants
 */
export const HTTP_CONTENT_TYPE = {
  JSON: "json",
  TEXT: "text",
  FORM_DATA: "formData",
  FORM_URL_ENCODED: "formUrlEncoded",
} as const;

/**
 * MIME types for HTTP content types
 */
export const HTTP_CONTENT_TYPE_HEADER = {
  [HTTP_CONTENT_TYPE.JSON]: "application/json",
  [HTTP_CONTENT_TYPE.TEXT]: "text/plain",
  [HTTP_CONTENT_TYPE.FORM_DATA]: "multipart/form-data",
  [HTTP_CONTENT_TYPE.FORM_URL_ENCODED]: "application/x-www-form-urlencoded",
} as const;

/**
 * HTTP method constants
 */
export const HTTP_METHOD = {
  GET: "GET",
  POST: "POST",
  PATCH: "PATCH",
  PUT: "PUT",
  DELETE: "DELETE",
} as const;

/**
 * OAuth token type constants
 */
export const TOKEN_TYPES = {
  BEARER: "Bearer",
  DPOP: "DPoP",
} as const;

export type HttpContentType =
  (typeof HTTP_CONTENT_TYPE)[keyof typeof HTTP_CONTENT_TYPE];

export type HttpContentTypeHeaders =
  (typeof HTTP_CONTENT_TYPE_HEADER)[keyof typeof HTTP_CONTENT_TYPE_HEADER];

export type HttpMethod = (typeof HTTP_METHOD)[keyof typeof HTTP_METHOD];

export type TokenType = (typeof TOKEN_TYPES)[keyof typeof TOKEN_TYPES];

/**
 * Configuration for public (non-authenticated) resources
 */
export interface PublicResourceConfig {
  /** Base URL for API requests (e.g., 'https://api.example.com') */
  baseUrl: string;
  /** Content type for requests (defaults to JSON if not specified) */
  contentType?: HttpContentType;
  /** Must be explicitly set to false for public resources */
  isProtected: false;
}

/**
 * Configuration for protected (authenticated) resources
 */
export interface PrivateResourceConfig {
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
}

export type OAuthFetchConfig = PublicResourceConfig | PrivateResourceConfig;

/**
 * Configuration for building request headers
 */
export interface HeadersConfig {
  /** Complete URL for the request including base URL and endpoint path */
  url: URL;
  /** HTTP method for the request */
  method: HttpMethod;
  /** Additional headers to include with the request */
  extraHeaders?: RequestInit["headers"];
  /** Token provider that can be overridden per request */
  tokenProvider?: AbstractTokenProvider;
  /** Optional configuration object for getToken method */
  getTokenOptions?: Record<string, unknown>;
  /** Whether this specific request requires authentication */
  isProtected?: boolean;
  /** Content type for the request body and headers */
  contentType: HttpContentType;
  /** DPoP nonce for replay protection */
  nonce?: string;
  /** Cryptographic key pair for DPoP proof generation */
  dpopKeyPair?: DPoPKeyPair;
}

/**
 * Extended request options that support authentication overrides and all standard fetch options
 */
export type CustomRequestInit = Omit<
  RequestInit,
  "method" | "body" | "headers"
> & {
  /** Additional headers to be included with the request */
  extraHeaders?: RequestInit["headers"];
  /** Override the default token provider for this specific request */
  tokenProvider?: AbstractTokenProvider;
  /** Override configuration object for getToken method */
  getTokenOptions?: Record<string, unknown>;
  /** Override the default protection setting for this specific request */
  isProtected?: boolean;
};

export type RequestBody = Record<string, unknown> | string;

/**
 * Options for making HTTP requests
 */
export interface RequestOptions extends CustomRequestInit {
  /** API endpoint path (relative to baseUrl) */
  endpoint: string;
  /** HTTP method (GET, POST, PUT, PATCH, DELETE) */
  method: HttpMethod;
  /** Additional headers to include with the request */
  extraHeaders?: RequestInit["headers"];
  /** Request body data */
  body?: RequestBody;
}

/**
 * Cryptographic key pair for DPoP token proof-of-possession
 */
export interface DPoPKeyPair {
  privateKey: CryptoKey;
  publicKey: CryptoKey;
}

/**
 * OAuth-compatible HTTP client that supports Bearer and DPoP tokens for secure API requests.
 *
 * This client can be configured globally for an API with default authentication settings,
 * but also supports per-request overrides for accessing resources with different token
 * scopes, audiences, or authentication requirements.
 *
 * All HTTP methods accept standard fetch options (cache, mode, credentials, signal, etc.)
 * in addition to the custom authentication options.
 *
 * @example
 * // Public API client
 * const publicClient = new OAuthFetch({
 *   baseUrl: 'https://api.example.com',
 *   isProtected: false
 * });
 *
 * // Protected API with Bearer tokens
 * const bearerClient = new OAuthFetch({
 *   baseUrl: 'https://api.example.com',
 *   tokenProvider: new MyTokenProvider()
 * });
 *
 * // Protected API with DPoP tokens
 * const dpopClient = new OAuthFetch({
 *   baseUrl: 'https://api.example.com',
 *   tokenProvider: new MyDPoPTokenProvider(),
 *   dpopKeyPair: await createDPoPKeyPair()
 * });
 */
export class OAuthFetch {
  #baseUrl: string;
  #contentType: HttpContentType;
  #isProtected: boolean;
  #cachedNonce: string | undefined;
  #tokenProvider?: AbstractTokenProvider;
  #dpopKeyPair?: DPoPKeyPair;

  /**
   * Initializes a new `OAuthFetch` instance with the provided configuration.
   *
   * @throws {Error} If `isProtected` is `true` and `tokenProvider` is not provided
   */
  constructor(config: OAuthFetchConfig) {
    this.#baseUrl = config.baseUrl;
    this.#contentType = config.contentType ?? HTTP_CONTENT_TYPE.JSON;
    this.#isProtected = config.isProtected ?? true;

    if (this.#isProtected) {
      if ("tokenProvider" in config) {
        this.#tokenProvider = config.tokenProvider;
      }
      if ("dpopKeyPair" in config) {
        this.#dpopKeyPair = config.dpopKeyPair;
      }
    }
  }

  /**
   * Constructs the necessary HTTP headers for an authenticated request.
   *
   * @throws {Error} If `isProtected` is `true` and `tokenProvider` is missing
   * @throws {Error} If DPoP token is used without providing a `dpopKeyPair`
   */
  async #createRequestHeaders(config: HeadersConfig): Promise<Headers> {
    const headers = new Headers();

    headers.set("Content-Type", HTTP_CONTENT_TYPE_HEADER[config.contentType]);

    // Can be overridden per request, falls back to the instance configuration.
    const isProtected = config.isProtected ?? this.#isProtected;

    if (isProtected) {
      // Can be overridden per request, falls back to the instance configuration.
      const tokenProvider = config.tokenProvider ?? this.#tokenProvider;

      if (!tokenProvider) {
        throw new Error("tokenProvider is required for protected resources");
      }

      const { token_type: tokenType, access_token: accessToken } =
        await tokenProvider.getToken(config.getTokenOptions);

      headers.set("Authorization", `${tokenType} ${accessToken}`);

      if (tokenType === TOKEN_TYPES.DPOP) {
        if (!config.dpopKeyPair) {
          throw new Error("dpopKeyPair is required for protected resources");
        }

        headers.set(
          "DPoP",
          await DPoPUtils.generateProof({
            url: config.url,
            method: config.method,
            dpopKeyPair: config.dpopKeyPair,
            nonce: config.nonce,
            accessToken: accessToken,
          })
        );
      }
    }

    if (config.extraHeaders) {
      const parsedExtraHeaders = new Headers(config.extraHeaders);
      parsedExtraHeaders.forEach((value, key) => {
        headers.set(key, value);
      });
    }

    return headers;
  }

  /**
   * Executes the HTTP request with authentication handling and response parsing.
   * Automatically handles DPoP nonce challenges if received from the server.
   */
  async #executeRequest({
    endpoint,
    method,
    body,
    extraHeaders,
    tokenProvider,
    isProtected,
    ...options
  }: RequestOptions): Promise<Response | string | FormData | unknown | null> {
    const url = new URL(endpoint, this.#baseUrl);

    const fetchOptions = {
      method,
      headers: await this.#createRequestHeaders({
        url,
        method,
        isProtected,
        contentType: this.#contentType,
        tokenProvider,
        dpopKeyPair: this.#dpopKeyPair,
        nonce: this.#cachedNonce,
        extraHeaders,
      }),
      body: formatRequestBody(this.#contentType, body),
      ...options,
    };

    let response = await fetch(url, fetchOptions);

    const nonce = response.headers.get("dpop-nonce");

    if (nonce) {
      this.#cachedNonce = nonce;

      if (!response.ok) {
        response = await fetch(url, fetchOptions);
      }
    }

    if (response.ok) {
      return await parseResponseBody(response);
    }

    throw response;
  }

  /**
   * Makes an HTTP GET request.
   */
  async get(endpoint: string, options?: CustomRequestInit) {
    return await this.#executeRequest({
      endpoint,
      method: HTTP_METHOD.GET,
      ...options,
    });
  }

  /**
   * Makes an HTTP DELETE request.
   */
  async delete(endpoint: string, options?: CustomRequestInit) {
    return await this.#executeRequest({
      endpoint,
      method: HTTP_METHOD.DELETE,
      ...options,
    });
  }

  /**
   * Makes an HTTP POST request.
   */
  async post(
    endpoint: string,
    body?: RequestBody,
    options?: CustomRequestInit
  ) {
    return await this.#executeRequest({
      endpoint,
      method: HTTP_METHOD.POST,
      body,
      ...options,
    });
  }

  /**
   * Makes an HTTP PATCH request.
   */
  async patch(
    endpoint: string,
    body?: RequestBody,
    options?: CustomRequestInit
  ) {
    return await this.#executeRequest({
      endpoint,
      method: HTTP_METHOD.PATCH,
      body,
      ...options,
    });
  }

  /**
   * Makes an HTTP PUT request.
   */
  async put(endpoint: string, body?: RequestBody, options?: CustomRequestInit) {
    return await this.#executeRequest({
      endpoint,
      method: HTTP_METHOD.PUT,
      body,
      ...options,
    });
  }
}
