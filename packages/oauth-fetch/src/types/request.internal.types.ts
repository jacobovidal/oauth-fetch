import { HTTP_CONTENT_TYPE, HTTP_CONTENT_TYPE_HEADER, HTTP_METHOD } from "../constants/index.js";

/**
 * Type representing the available HTTP content types defined in the `HTTP_CONTENT_TYPE` constant.
 * It includes values like 'json', 'text', 'formData', and 'formUrlEncoded'.
 */
export type HttpContentType =
  (typeof HTTP_CONTENT_TYPE)[keyof typeof HTTP_CONTENT_TYPE];

/**
 * Type representing the corresponding MIME types for the HTTP content types, as defined in the `HTTP_CONTENT_TYPE_HEADER` constant.
 * It maps content types to their appropriate MIME type (e.g., 'application/json', 'text/plain').
 */
export type HttpContentTypeHeaders =
  (typeof HTTP_CONTENT_TYPE_HEADER)[keyof typeof HTTP_CONTENT_TYPE_HEADER];

/**
 * Type representing the available HTTP methods defined in the `HTTP_METHOD` constant.
 * It includes methods like 'GET', 'POST', 'PATCH', 'PUT', and 'DELETE'.
 */
export type HttpMethod = (typeof HTTP_METHOD)[keyof typeof HTTP_METHOD];
