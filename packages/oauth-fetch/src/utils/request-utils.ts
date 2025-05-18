import { HTTP_CONTENT_TYPE } from "../constants/index.js";
import type { HttpContentType } from "../types/request.types.js";
import type { RequestBody } from "../types/oauth-fetch.types.js";
import { HTTP_CONTENT_TYPE_HEADER } from "../constants/index.internal.js";
import { ERR_DESCRIPTION, ApiReponseParseError } from "../errors/errors.js";

/**
 * Parses an HTTP response based on its content type
 */
export async function parseResponseBody(
  response: Response,
): Promise<string | unknown | FormData | null> {
  const contentType = response.headers.get("Content-Type");

  if (!contentType) {
    if (response.status === 204) {
      return null;
    }

    console.warn("No Content-Type header. Returning response as text.");
    return await response.text();
  }

  try {
    if (
      contentType.includes(HTTP_CONTENT_TYPE_HEADER[HTTP_CONTENT_TYPE.JSON])
    ) {
      return await response.json();
    }

    if (
      contentType.includes(HTTP_CONTENT_TYPE_HEADER[HTTP_CONTENT_TYPE.TEXT])
    ) {
      return await response.text();
    }

    if (
      contentType.includes(
        HTTP_CONTENT_TYPE_HEADER[HTTP_CONTENT_TYPE.FORM_DATA],
      )
    ) {
      return await response.formData();
    }

    if (
      contentType.includes(
        HTTP_CONTENT_TYPE_HEADER[HTTP_CONTENT_TYPE.FORM_URL_ENCODED],
      )
    ) {
      return await response.text();
    }

    console.warn(
      `Unsupported Content-Type: ${contentType}. Returning as text.`,
    );
    return await response.text();
  } catch (e) {
    throw new ApiReponseParseError(
      ERR_DESCRIPTION.RESPONSE.BODY_PARSING_ERROR,
      response,
      e,
      await response
        .clone()
        .text()
        .catch(() => undefined),
    );
  }
}

/**
 * Creates the appropriate request body based on content type
 */
export function formatRequestBody(
  contentType: HttpContentType,
  body?: RequestBody,
): BodyInit | undefined {
  if (!body) {
    return undefined;
  }

  switch (contentType) {
    case HTTP_CONTENT_TYPE.JSON:
      return JSON.stringify(body);

    case HTTP_CONTENT_TYPE.TEXT:
      return String(body);

    case HTTP_CONTENT_TYPE.FORM_DATA: {
      const formData = new FormData();
      Object.entries(body).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      return formData;
    }

    case HTTP_CONTENT_TYPE.FORM_URL_ENCODED: {
      const params = new URLSearchParams();
      Object.entries(body).forEach(([key, value]) => {
        params.append(key, value as string);
      });
      return params.toString();
    }

    default:
      console.warn(
        `Unsupported Content-Type: ${contentType}. Using text format.`,
      );
      return String(body);
  }
}
