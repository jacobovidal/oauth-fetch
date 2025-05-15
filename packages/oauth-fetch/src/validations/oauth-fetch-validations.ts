import { SUPPORTED_TOKEN_TYPES } from "../constants/index.js";
import { AbstractTokenProvider } from "../providers/abstract-token-provider.js";
import {
  OAuthFetchConfig,
  OAuthFetchPrivateResourceConfig,
} from "../types/oauth-fetch.types.js";
import { TokenProviderTokenType } from "../types/token-provider.types.js";
import { OAUTH_FETCH_ERROR_DESCRIPTIONS } from "../errors/oauth-fetch.errors.js";

export function validateProtectedResourceConfig(
  config: OAuthFetchConfig,
): asserts config is OAuthFetchPrivateResourceConfig {
  if (
    !("tokenProvider" in config) ||
    !(config.tokenProvider instanceof AbstractTokenProvider)
  ) {
    throw new Error(OAUTH_FETCH_ERROR_DESCRIPTIONS.REQUIRED_TOKEN_PROVIDER);
  }
}

export function validateTokenProvider(
  tokenProvider: AbstractTokenProvider<unknown> | undefined,
): asserts tokenProvider is AbstractTokenProvider {
  if (!(tokenProvider instanceof AbstractTokenProvider)) {
    throw new Error(OAUTH_FETCH_ERROR_DESCRIPTIONS.REQUIRED_TOKEN_PROVIDER);
  }
}

export function validateSupportedTokenType(
  tokenType: TokenProviderTokenType,
): asserts tokenType is TokenProviderTokenType {
  const isTokenTypeSupported = Object.values(SUPPORTED_TOKEN_TYPES).some(
    (types: readonly TokenProviderTokenType[]) => types.includes(tokenType),
  );

  if (!isTokenTypeSupported) {
    throw new Error(
      OAUTH_FETCH_ERROR_DESCRIPTIONS.NOT_SUPPORTED_TOKEN_TYPE(tokenType),
    );
  }
}
