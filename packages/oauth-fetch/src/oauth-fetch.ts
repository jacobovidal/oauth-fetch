import { AbstractTokenProvider } from "./providers/abstract-token-provider.js";
import { DPoPUtils } from "./utils/dpop-utils.js";
import { formatRequestBody, parseResponseBody } from "./utils/request-utils.js";
import {
  HTTP_CONTENT_TYPE,
  HTTP_METHOD,
  SUPPORTED_TOKEN_TYPES,
} from "./constants/index.js";
import { HTTP_CONTENT_TYPE_HEADER } from "./constants/index.internal.js";
import type { HttpContentType } from "./types/request.types.js";
import type { DPoPKeyPair } from "./types/dpop.types.js";
import type {
  OAuthFetchPrivateResourceConfig,
  OAuthFetchPublicResourceConfig,
  RequestBody,
  RequestOptions,
} from "./types/oauth-fetch.types.js";
import type {
  ExecuteRequestOptions,
  RequestHeadersConfig,
} from "./types/oauth-fetch.internal.types.js";
import {
  validateProtectedResourceConfig,
  validateTokenProvider,
  validateTokenProviderResponse,
} from "./validations/oauth-fetch-validations.js";
import { validateDpopKeyPair } from "./validations/dpop-validations.js";
import { ERR_DESCRIPTION, ApiResponseError } from "./errors/errors.js";

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
  #customFetch: typeof fetch;

  /**
   * Initializes a new `OAuthFetch` instance with the provided configuration.
   *
   * @throws {ConfigurationError} If `isProtected` is `true` and `tokenProvider` is not provided
   */
  constructor(
    config: OAuthFetchPrivateResourceConfig | OAuthFetchPublicResourceConfig,
  ) {
    this.#baseUrl = config.baseUrl;
    this.#contentType = config.contentType ?? HTTP_CONTENT_TYPE.JSON;
    this.#isProtected = config.isProtected ?? true;
    this.#customFetch = config.customFetch ?? fetch;

    if (this.#isProtected) {
      validateProtectedResourceConfig(config);

      this.#tokenProvider = config.tokenProvider;
      this.#dpopKeyPair = config.dpopKeyPair;
    }
  }

  /**
   * Constructs the necessary HTTP headers for an authenticated request.
   *
   * @throws {ConfigurationError} If `isProtected` is `true` and `tokenProvider` is missing
   * @throws {ConfigurationError} If DPoP token is used without providing a `dpopKeyPair`
   */
  async #createRequestHeaders(config: RequestHeadersConfig): Promise<Headers> {
    const headers = new Headers();

    headers.set("Content-Type", HTTP_CONTENT_TYPE_HEADER[config.contentType]);

    // Can be overridden per request, falls back to the instance configuration.
    const isProtected = config.isProtected ?? this.#isProtected;

    if (isProtected) {
      // Can be overridden per request, falls back to the instance configuration.
      const tokenProvider = config.tokenProvider ?? this.#tokenProvider;

      validateTokenProvider(tokenProvider);

      const tokenResponse = await tokenProvider.getToken();

      validateTokenProviderResponse(tokenResponse);

      const { token_type: tokenType, access_token: accessToken } =
        tokenResponse;

      headers.set("Authorization", `${tokenType} ${accessToken}`);

      const isDPoP = SUPPORTED_TOKEN_TYPES.DPOP.some(
        (supportedType) =>
          supportedType.toUpperCase() === tokenType.toUpperCase(),
      );

      if (isDPoP) {
        validateDpopKeyPair(config.dpopKeyPair);

        headers.set(
          "DPoP",
          await DPoPUtils.generateProof({
            url: config.url,
            method: config.method,
            dpopKeyPair: config.dpopKeyPair,
            nonce: config.nonce,
            accessToken: accessToken,
          }),
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
    isProtected,
    tokenProvider,
    ...options
  }: ExecuteRequestOptions): Promise<
    Response | string | FormData | unknown | null
  > {
    const url = new URL(endpoint, this.#baseUrl);

    const buildFetchOptions = async (nonce?: string): Promise<RequestInit> => {
      return {
        method,
        headers: await this.#createRequestHeaders({
          url,
          method,
          isProtected,
          tokenProvider,
          contentType: this.#contentType,
          dpopKeyPair: this.#dpopKeyPair,
          nonce: nonce ?? this.#cachedNonce,
          extraHeaders,
        }),
        body: formatRequestBody(this.#contentType, body),
        ...options,
      };
    };

    const fetchOptions = await buildFetchOptions();

    let response = await this.#customFetch(url, fetchOptions);

    const nonce = response.headers.get("dpop-nonce");
    const wwwAuthenticateHeader = response.headers.get("www-authenticate");

    if (nonce) {
      this.#cachedNonce = nonce;

      if (wwwAuthenticateHeader?.includes("use_dpop_nonce")) {
        const fetchOptionsWithNonce = await buildFetchOptions(nonce);
        response = await this.#customFetch(url, fetchOptionsWithNonce);
      }
    }

    const parsedBody = await parseResponseBody(response).catch(() => undefined);

    if (response.ok) {
      return parsedBody;
    }

    throw new ApiResponseError(
      ERR_DESCRIPTION.RESPONSE.NON_SUCCESSFUL(
        url,
        fetchOptions.method,
        response,
      ),
      response,
      parsedBody,
    );
  }

  /**
   * Makes an HTTP GET request.
   *
   * @throws {ApiResponseError} If API responds with a non-successful status code
   * @throws {ConfigurationError} If `isProtected` is `true` and `tokenProvider` is missing
   * @throws {ConfigurationError} If token provider returns a DPoP token type, and `dpopKeyPair` is missing
   */
  async get(endpoint: string, options?: RequestOptions) {
    return await this.#executeRequest({
      endpoint,
      method: HTTP_METHOD.GET,
      ...options,
    });
  }

  /**
   * Makes an HTTP DELETE request.
   *
   * @throws {ApiResponseError} If API responds with a non-successful status code
   * @throws {ConfigurationError} If `isProtected` is `true` and `tokenProvider` is missing
   * @throws {ConfigurationError} If token provider returns a DPoP token type, and `dpopKeyPair` is missing
   */
  async delete(endpoint: string, body?: RequestBody, options?: RequestOptions) {
    return await this.#executeRequest({
      endpoint,
      method: HTTP_METHOD.DELETE,
      body,
      ...options,
    });
  }

  /**
   * Makes an HTTP POST request.
   *
   * @throws {ApiResponseError} If API responds with a non-successful status code
   * @throws {ConfigurationError} If `isProtected` is `true` and `tokenProvider` is missing
   * @throws {ConfigurationError} If token provider returns a DPoP token type, and `dpopKeyPair` is missing
   */
  async post(endpoint: string, body?: RequestBody, options?: RequestOptions) {
    return await this.#executeRequest({
      endpoint,
      method: HTTP_METHOD.POST,
      body,
      ...options,
    });
  }

  /**
   * Makes an HTTP PATCH request.
   *
   * @throws {ApiResponseError} If API responds with a non-successful status code
   * @throws {ConfigurationError} If `isProtected` is `true` and `tokenProvider` is missing
   * @throws {ConfigurationError} If token provider returns a DPoP token type, and `dpopKeyPair` is missing
   */
  async patch(endpoint: string, body?: RequestBody, options?: RequestOptions) {
    return await this.#executeRequest({
      endpoint,
      method: HTTP_METHOD.PATCH,
      body,
      ...options,
    });
  }

  /**
   * Makes an HTTP PUT request.
   *
   * @throws {ApiResponseError} If API responds with a non-successful status code
   * @throws {ConfigurationError} If `isProtected` is `true` and `tokenProvider` is missing
   * @throws {ConfigurationError} If token provider returns a DPoP token type, and `dpopKeyPair` is missing
   */
  async put(endpoint: string, body?: RequestBody, options?: RequestOptions) {
    return await this.#executeRequest({
      endpoint,
      method: HTTP_METHOD.PUT,
      body,
      ...options,
    });
  }
}
