export class PKCEError extends Error {
  public code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "PKCEError";
    this.code = code;
  }
}

export const PKCE_ERROR_CODES = {
  INVALID_CONFIGURATION: "invalid_configuration",
};

export const PKCE_ERROR_DESCRIPTIONS = {
  INVALID_CODE_VERIFIER_LENGTH:
    "Code verifier length must be between 43 and 128 characters as per RFC 7636",
  INVALID_CODE_VERIFIER: "Code verifier must be a non-empty string",
};
