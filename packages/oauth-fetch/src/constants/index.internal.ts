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
