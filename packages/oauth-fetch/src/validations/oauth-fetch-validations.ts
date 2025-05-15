import { SUPPORTED_TOKEN_TYPES } from "../constants/index.js";
import { AbstractTokenProvider } from "../providers/abstract-token-provider.js";
import {
  OAuthFetchConfig,
  OAuthFetchPrivateResourceConfig,
} from "../types/oauth-fetch.types.js";
import {
  TokenProviderGetTokenResponse,
  TokenProviderTokenType,
} from "../types/token-provider.types.js";
import {
  ConfigurationError,
  OAUTH_FETCH_ERROR_DESCRIPTIONS,
  TokenProviderError,
} from "../errors/oauth-fetch.errors.js";

export function validateProtectedResourceConfig(
  config: OAuthFetchConfig,
): asserts config is OAuthFetchPrivateResourceConfig {
  if (
    !("tokenProvider" in config) ||
    !(config.tokenProvider instanceof AbstractTokenProvider)
  ) {
    throw new ConfigurationError(
      OAUTH_FETCH_ERROR_DESCRIPTIONS.REQUIRED_TOKEN_PROVIDER,
    );
  }
}

export function validateTokenProvider(
  tokenProvider: AbstractTokenProvider<unknown> | undefined,
): asserts tokenProvider is AbstractTokenProvider {
  if (!(tokenProvider instanceof AbstractTokenProvider)) {
    throw new ConfigurationError(
      OAUTH_FETCH_ERROR_DESCRIPTIONS.REQUIRED_TOKEN_PROVIDER,
    );
  }
}

export function validateTokenProviderResponse(
  tokenResponse: TokenProviderGetTokenResponse,
) {
  const { token_type: tokenType, access_token: accessToken } = tokenResponse;

  if (!accessToken) {
    throw new TokenProviderError(
      OAUTH_FETCH_ERROR_DESCRIPTIONS.MISSING_ACCESS_TOKEN,
    );
  }

  if (!tokenType) {
    throw new TokenProviderError(
      OAUTH_FETCH_ERROR_DESCRIPTIONS.MISSING_TOKEN_TYPE,
    );
  }

  const isTokenTypeSupported = Object.values(SUPPORTED_TOKEN_TYPES).some(
    (types: readonly TokenProviderTokenType[]) => types.includes(tokenType),
  );

  if (!isTokenTypeSupported) {
    throw new TokenProviderError(
      OAUTH_FETCH_ERROR_DESCRIPTIONS.NOT_SUPPORTED_TOKEN_TYPE(tokenType),
    );
  }
}
