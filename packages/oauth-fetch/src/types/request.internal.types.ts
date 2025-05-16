import { HTTP_CONTENT_TYPE_HEADER } from "../constants/index.internal.js";

/**
 * Type representing the corresponding MIME types for the HTTP content types, as defined in the `HTTP_CONTENT_TYPE_HEADER` constant.
 * It maps content types to their appropriate MIME type (e.g., 'application/json', 'text/plain').
 */
export type HttpContentTypeHeaders =
  (typeof HTTP_CONTENT_TYPE_HEADER)[keyof typeof HTTP_CONTENT_TYPE_HEADER];
