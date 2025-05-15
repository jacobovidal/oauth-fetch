export const PKCE_ERROR_CODES = {
  INVALID_CONFIGURATION: "invalid_configuration",
} as const;

export type PKCEErrorCode =
  (typeof PKCE_ERROR_CODES)[keyof typeof PKCE_ERROR_CODES];

export const PKCE_ERROR_DESCRIPTIONS = {
  INVALID_CODE_VERIFIER_LENGTH:
    "Code verifier length must be between 43 and 128 characters as per RFC 7636",
  INVALID_CODE_VERIFIER: "Code verifier must be a non-empty string",
} as const;

export class PKCEError extends Error {
  public readonly code: PKCEErrorCode;
  public readonly cause?: unknown;

  constructor(
    code: PKCEErrorCode,
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
export class ConfigurationError extends PKCEError {
  constructor(message: string, options?: { cause?: unknown }) {
    super(PKCE_ERROR_CODES.INVALID_CONFIGURATION, message, options);
  }
}
