import { SUPPORTED_TOKEN_TYPES } from "../constants/index.js";

export const OAUTH_FETCH_ERROR_CODES = {
  INVALID_CONFIGURATION: "invalid_configuration",
  TOKEN_PROVIDER_ERROR: "token_provider_error",
  RESPONSE_ERROR: "response_error",
  RESPONSE_PARSE_ERROR: "response_parse_error",
  REQUEST_ERROR: "request_error",
  ABORT_ERROR: "abort_error",
} as const;

export type OAuthFetchErrorCode =
  (typeof OAUTH_FETCH_ERROR_CODES)[keyof typeof OAUTH_FETCH_ERROR_CODES];

export const OAUTH_FETCH_ERROR_DESCRIPTIONS = {
  REQUIRED_TOKEN_PROVIDER: "tokenProvider is required for protected resources",
  MISSING_ACCESS_TOKEN: "Token provider didn't return an access_token",
  MISSING_TOKEN_TYPE: "Token provider didn't return a token_type",
  NOT_SUPPORTED_TOKEN_TYPE: (tokenType: string): string =>
    `Token provider returned an unsupported token type: "${tokenType}". Supported types are: ${Object.keys(
      SUPPORTED_TOKEN_TYPES,
    )
      .flat()
      .join(", ")}`,
  FAILED_PARSING__BODY: "Failed to parse the response body",
  REQUEST_ABORT_ERROR: "The fetch request was aborted",
  REQUEST_TYPE_ERROR: "Network or request type error occurred during fetch",
  REQUEST_UNKNOWN: "Fetch request failed with an unknown error",
  NON_SUCCESSFUL_RESPONSE:
    "Fetch request failed with a non-successful response",
} as const;

export class OAuthFetchError extends Error {
  public readonly code: OAuthFetchErrorCode;
  public readonly cause?: unknown;

  constructor(
    code: OAuthFetchErrorCode,
    message: string,
    options?: { cause?: unknown },
  ) {
    super(message, options);
    this.name = this.constructor.name;
    this.code = code;
    this.cause = options?.cause;
  }
}

// Error thrown when the configuration is invalid
export class ConfigurationError extends OAuthFetchError {
  constructor(message: string, options?: { cause?: unknown }) {
    super(OAUTH_FETCH_ERROR_CODES.INVALID_CONFIGURATION, message, options);
  }
}

// Error thrown when there's an issue with the token provider
export class TokenProviderError extends OAuthFetchError {
  constructor(message: string, options?: { cause?: unknown }) {
    super(OAUTH_FETCH_ERROR_CODES.TOKEN_PROVIDER_ERROR, message, options);
  }
}

// Error thrown when there's an issue with the response
export class ResponseError extends OAuthFetchError {
  public readonly status?: number;
  public readonly body?: unknown;

  constructor(
    message: string,
    options?: { cause?: unknown; status?: number; body?: unknown },
  ) {
    super(OAUTH_FETCH_ERROR_CODES.RESPONSE_ERROR, message, options);
    this.status = options?.status;
    this.body = options?.body;
  }
}

// Error thrown when there's an issue parsing the response
export class ResponseParseError extends OAuthFetchError {
  public readonly rawData?: unknown;

  constructor(
    message: string,
    options?: { cause?: unknown; rawData?: unknown },
  ) {
    super(OAUTH_FETCH_ERROR_CODES.RESPONSE_PARSE_ERROR, message, options);
    this.rawData = options?.rawData;
  }
}

// Error thrown when there's an issue with the request
export class RequestError extends OAuthFetchError {
  constructor(message: string, options?: { cause?: unknown }) {
    super(OAUTH_FETCH_ERROR_CODES.REQUEST_ERROR, message, options);
  }
}

// Error thrown when there's a network issue
export class RequestAbortError extends OAuthFetchError {
  constructor(message: string, options?: { cause?: unknown }) {
    super(OAUTH_FETCH_ERROR_CODES.ABORT_ERROR, message, options);
  }
}
