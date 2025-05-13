import { HTTP_CONTENT_TYPE, HTTP_METHOD } from "../constants/index.js";

/**
 * Type representing the available HTTP content types defined in the `HTTP_CONTENT_TYPE` constant.
 * It includes values like 'json', 'text', 'formData', and 'formUrlEncoded'.
 */
export type HttpContentType =
  (typeof HTTP_CONTENT_TYPE)[keyof typeof HTTP_CONTENT_TYPE];

  /**
 * Type representing the available HTTP methods defined in the `HTTP_METHOD` constant.
 * It includes methods like 'GET', 'POST', 'PATCH', 'PUT', and 'DELETE'.
 */
export type HttpMethod = (typeof HTTP_METHOD)[keyof typeof HTTP_METHOD];
