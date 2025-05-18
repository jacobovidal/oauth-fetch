import { DPoPSupportedAlgorithms } from "../types/dpop.types.js";
import {
  DPOP_SUPPORTED_ALGORITHMS,
  SUPPORTED_TOKEN_TYPES,
} from "../constants/index.js";

export const ERR_DESCRIPTION = {
  TOKEN_PROVIDER: {
    REQUIRED: "tokenProvider is required for protected resources",
    MISSING_ACCESS_TOKEN: "Token provider didn't return an access_token",
    MISSING_TOKEN_TYPE: "Token provider didn't return a token_type",
    UNSUPPORTED_TOKEN_TYPE: (tokenType: string): string =>
      `Token provider returned an unsupported token type: "${tokenType}". Supported types are: ${Object.keys(
        SUPPORTED_TOKEN_TYPES,
      )
        .flat()
        .join(", ")}`,
  },
  RESPONSE: {
    BODY_PARSING_ERROR: "Failed to parse the response body",
    NON_SUCCESSFUL: (
      url: URL,
      method: RequestInit["method"],
      response: Response,
    ) =>
      `[${method}] request to [${url.href}] returned ${response.status} status code (${response.statusText})`,
  },
  DPOP: {
    REQUIRED:
      "dpopKeyPair is required for protected resources with DPoP token type",
    INVALID_INSTANCE:
      "dpopKeyPair must contain valid CryptoKey instances for both public and private keys",
    PRIVATE_KEY_NON_EXPORTABLE:
      "dpopKeyPair.privateKey should not be exportable for security reasons",
    PRIVATE_KEY_SIGN_USAGE:
      "dpopKeyPair.privateKey must include 'sign' usage permission",
  },
  PKCE: {
    INVALID_CODE_VERIFIER_LENGTH:
      "Code verifier length must be between 43 and 128 characters as per RFC 7636",
    INVALID_CODE_VERIFIER: "Code verifier must be a non-empty string",
  },
  CRYPTO: {
    UNSUPPORTED_PUBLIC_KEY_TYPE: (publicKeyType: string) =>
      `Unsupported public key type: "${publicKeyType}". Supported public key types are: RSA, EC, OKP`,
    UNSUPPORTED_ALGORITHM: (algorithm: string) =>
      `Unsupported algorithm "${algorithm}". Supported algorithms are: ${Object.keys(
        DPOP_SUPPORTED_ALGORITHMS,
      ).join(", ")}`,
    UNSUPPORTED_ALGORITHM_CONFIGURATION: (algorithm: DPoPSupportedAlgorithms) =>
      `Unsupported configuration. For algorithm "${algorithm}", valid options are: ${DPOP_SUPPORTED_ALGORITHMS[
        algorithm
      ].join(", ")}`,
    UNSUPPORTED_ALGORITHM_WITH_CURVE_OR_MODULUS: (
      algorithm: string,
      curveOrModulus: string,
    ) =>
      `Unsupported algorithm "${algorithm}" with curve/modulus "${curveOrModulus}".`,
    UNSUPPORTED_CRYPTO_RSA_HASH_ALGORITHM: (hashName: string) =>
      `Unsupported RSA hash algorithm: ${hashName}. Supported algorithms are: SHA-256, SHA-384, SHA-512`,
    INVALID_CRYPTO_RSA_MODULUS_LENGTH:
      "RSA key modulus length must be at least 2048 bits",
    UNSUPPORTED_CRYPTO_ECDSA_CURVE: (namedCurve: string) =>
      `Unsupported ECDSA curve: ${namedCurve}. Supported curves are: P-256, P-384, P-521`,
    UNSUPPORTED_RSA_PSS_HASH_ALGORITHM: (hashName: string) =>
      `Unsupported RSA-PSS hash algorithm: ${hashName}. Supported algorithms are: SHA-256, SHA-384, SHA-512`,
  },
} as const;

export class BaseError extends Error {
  public readonly code: string;
  public readonly cause?: unknown;

  constructor(code: string, message: string, cause?: unknown) {
    super(message);
    this.name = "BaseError";
    this.code = code;
    this.cause = cause;
  }
}

// Error thrown when the configuration is invalid
export class ConfigurationError extends BaseError {
  constructor(message: string, cause?: unknown) {
    super("invalid_configuration", message, cause);
    this.name = "ConfigurationError";
  }
}

// Error thrown when there's an issue with the token provider
export class TokenProviderError extends BaseError {
  constructor(message: string, cause?: unknown) {
    super("token_provider_error", message, cause);
    this.name = "TokenProviderError";
  }
}

// Error thrown when non-successful API response
export class ResponseApiError extends Error {
  public readonly response: Response;
  public readonly status: number;
  public readonly statusText: string;
  public readonly body?: unknown;

  constructor(message: string, response: Response, body?: unknown) {
    super(message);
    this.name = "ResponseApiError";
    this.status = response.status;
    this.statusText = response.statusText;
    this.response = response;
    this.body = body;
  }
}

// Error thrown when there's an issue parsing the API response
export class ResponseParseError extends ResponseApiError {
  public readonly parseError: unknown;

  constructor(
    message: string,
    response: Response,
    parseError: unknown,
    body?: unknown,
  ) {
    super(message, response, body);
    this.name = "ResponseParseError";
    this.parseError = parseError;
  }
}
