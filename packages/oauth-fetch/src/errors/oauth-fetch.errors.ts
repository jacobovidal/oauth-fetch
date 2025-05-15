import { SUPPORTED_TOKEN_TYPES } from "../constants/index.js";

export class OAuthFetchError extends Error {}

export class ConfigurationError extends OAuthFetchError {}

export class TokenProviderError extends OAuthFetchError {}

export class ResponseError extends OAuthFetchError {}
export class BodyParseError extends ResponseError {}

export class RequestError extends OAuthFetchError {}

export class NetworkError extends OAuthFetchError {}

export class TimeoutError extends OAuthFetchError {}

export const OAUTH_FETCH_ERROR_CODES = {
  INVALID_CONFIGURATION: "invalid_configuration",
};

export const OAUTH_FETCH_ERROR_DESCRIPTIONS = {
  REQUIRED_TOKEN_PROVIDER: "tokenProvider is required for protected resources",
  NOT_SUPPORTED_TOKEN_TYPE: (tokenType: string) =>
    `Unsupported token type: "${tokenType}". Supported types are: ${Object.keys(
      SUPPORTED_TOKEN_TYPES
    )
      .flat()
      .join(", ")}`,
} as const;
