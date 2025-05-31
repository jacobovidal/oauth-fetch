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
  BEARER: "Bearer",
  DPOP: "DPoP",
} as const;

/**
 * Supported cryptographic algorithms for DPoP, along with their valid parameters.
 * - ECDSA: P-256, P-384, P-521 curves
 * - RSA-PSS: 2048, 3072, 4096 bit modulus lengths
 * - EdDSA: Ed25519 curve
 */
export const DPOP_SUPPORTED_ALGORITHMS = {
  ECDSA: ["P-256", "P-384", "P-521"],
  "RSA-PSS": ["2048", "3072", "4096"],
  EdDSA: ["Ed25519"],
} as const;
