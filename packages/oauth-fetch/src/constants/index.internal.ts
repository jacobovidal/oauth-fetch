import { HTTP_CONTENT_TYPE } from "./index.js";

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
 * Default PKCE code verifier length, recommended by RFC 7636.
 * It provides a good security balance with a length between 43 and 128 characters.
 *
 * @see https://datatracker.ietf.org/doc/html/rfc7636#section-4.1
 */
export const DEFAULT_PKCE_CODE_VERIFIER_LENGTH = 64;
