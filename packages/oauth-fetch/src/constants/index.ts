/**
 * HTTP content type constants, representing common content types used in requests and responses.
 */
export const HTTP_CONTENT_TYPE = {
  JSON: "json",
  TEXT: "text",
  FORM_DATA: "formData",
  FORM_URL_ENCODED: "formUrlEncoded",
} as const;

/**
 * MIME type mappings for HTTP content types.
 * This provides the appropriate MIME type for each HTTP content type.
 */
export const HTTP_CONTENT_TYPE_HEADER = {
  [HTTP_CONTENT_TYPE.JSON]: "application/json",
  [HTTP_CONTENT_TYPE.TEXT]: "text/plain",
  [HTTP_CONTENT_TYPE.FORM_DATA]: "multipart/form-data",
  [HTTP_CONTENT_TYPE.FORM_URL_ENCODED]: "application/x-www-form-urlencoded",
} as const;

/**
 * Constants for HTTP methods (GET, POST, PATCH, PUT, DELETE).
 */
export const HTTP_METHOD = {
  GET: "GET",
  POST: "POST",
  PATCH: "PATCH",
  PUT: "PUT",
  DELETE: "DELETE",
} as const;

/**
 * Supported OAuth token types, including case-insensitive variations for each type.
 */
export const SUPPORTED_TOKEN_TYPES = {
  BEARER: ["Bearer", "bearer", "BEARER"] as const,
  DPOP: ["DPoP", "dpop", "DPOP"] as const,
} as const;

/**
 * Supported cryptographic algorithms for DPoP, along with their valid parameters.
 * - ECDSA: P-256, P-384, P-521 curves
 * - RSA-PSS: 2048, 3072, 4096 bit modulus lengths
 * - EdDSA: Ed25519 curve
 */
export const DPOP_SUPPORTED_ALGORITHMS = {
  ECDSA: ["P-256", "P-384", "P-521"] as const,
  "RSA-PSS": ["2048", "3072", "4096"] as const,
  EdDSA: ["Ed25519"] as const,
} as const;

/**
 * Default PKCE code verifier length, recommended by RFC 7636.
 * It provides a good security balance with a length between 43 and 128 characters.
 * 
 * @see https://datatracker.ietf.org/doc/html/rfc7636#section-4.1
 */
export const DEFAULT_PKCE_CODE_VERIFIER_LENGTH = 64;
