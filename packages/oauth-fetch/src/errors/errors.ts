export const ERR_DESCRIPTION = {
  TOKEN_PROVIDER: {
    REQUIRED: "tokenProvider is required for protected resources",
    MISSING_ACCESS_TOKEN: "Token provider didn't return an access_token",
    MISSING_TOKEN_TYPE: "Token provider didn't return a token_type",
    UNSUPPORTED_TOKEN_TYPE: `Token provider returned an unsupported token type. Supported types are: DPoP, Bearer`,
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
    UNSUPPORTED_PUBLIC_KEY_TYPE:
      "Unsupported public key type. Supported public key types are: RSA, EC, OKP",
    UNSUPPORTED_ALGORITHM: "Unsupported algorithm",
    UNSUPPORTED_ALGORITHM_CONFIGURATION:
      "Unsupported algorithm or curve/modulus combination",
    UNSUPPORTED_RSA_HASH_ALGORITHM:
      "Unsupported RSA hash algorithm. Supported algorithms are: SHA-256, SHA-384, SHA-512",
    INVALID_RSA_MODULUS_LENGTH:
      "RSA key modulus length must be at least 2048 bits",
    UNSUPPORTED_ECDSA_CURVE:
      "Unsupported ECDSA curve. Supported curves are: P-256, P-384, P-521",
    UNSUPPORTED_RSA_PSS_HASH_ALGORITHM:
      "Unsupported RSA-PSS hash algorithm. Supported algorithms are: SHA-256, SHA-384, SHA-512",
  },
};

/**
 * @internal
 * Base error class.
 */
export class BaseError extends Error {
  /**
   * @internal
   */
  constructor(message: string) {
    super(message);
    this.name = "BaseError";
  }
}

/**
 * Error thrown when the configuration is invalid.
 *
 * @group Errors
 */
export class ConfigurationError extends BaseError {
  /**
   * @internal
   */
  constructor(message: string) {
    super(message);
    this.name = "ConfigurationError";
  }
}

/**
 * Error thrown when there's an issue with the token provider.
 *
 * @group Errors
 */
export class TokenProviderError extends BaseError {
  /**
   * @internal
   */
  constructor(message: string) {
    super(message);
    this.name = "TokenProviderError";
  }
}

/**
 * Error thrown when non-successful API response is returned.
 *
 * @group Errors
 */
export class ApiResponseError extends BaseError {
  public readonly response: Response;
  public readonly status: number;
  public readonly statusText: string;
  public readonly body?: unknown;

  /**
   * @internal
   */
  constructor(message: string, response: Response, body?: unknown) {
    super(message);
    this.name = "ApiResponseError";
    this.status = response.status;
    this.statusText = response.statusText;
    this.response = response;
    this.body = body;
  }
}
