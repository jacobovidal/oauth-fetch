import { SUPPORTED_TOKEN_TYPES } from "../constants/index.js";
import { AbstractTokenProvider } from "../providers/abstract-token-provider.js";
import type {
  OAuthFetchPrivateResourceConfig,
  OAuthFetchPublicResourceConfig,
} from "../types/oauth-fetch.types.js";
import type {
  TokenProviderGetTokenResponse,
  TokenProviderTokenType,
} from "../types/token-provider.types.js";
import {
  ConfigurationError,
  ERR_DESCRIPTION,
  TokenProviderError,
} from "../errors/errors.js";

export function validateProtectedResourceConfig(
  config: OAuthFetchPrivateResourceConfig | OAuthFetchPublicResourceConfig,
): asserts config is OAuthFetchPrivateResourceConfig {
  if (
    !("tokenProvider" in config) ||
    !(config.tokenProvider instanceof AbstractTokenProvider)
  ) {
    throw new ConfigurationError(ERR_DESCRIPTION.TOKEN_PROVIDER.REQUIRED);
  }
}

export function validateTokenProvider(
  tokenProvider: AbstractTokenProvider<unknown> | undefined,
): asserts tokenProvider is AbstractTokenProvider {
  if (!(tokenProvider instanceof AbstractTokenProvider)) {
    throw new ConfigurationError(ERR_DESCRIPTION.TOKEN_PROVIDER.REQUIRED);
  }
}

export function validateTokenProviderResponse(
  tokenResponse: TokenProviderGetTokenResponse,
) {
  const { token_type: tokenType, access_token: accessToken } = tokenResponse;

  if (!accessToken) {
    throw new TokenProviderError(
      ERR_DESCRIPTION.TOKEN_PROVIDER.MISSING_ACCESS_TOKEN,
    );
  }

  if (!tokenType) {
    throw new TokenProviderError(
      ERR_DESCRIPTION.TOKEN_PROVIDER.MISSING_TOKEN_TYPE,
    );
  }

  const isTokenTypeSupported = Object.values(SUPPORTED_TOKEN_TYPES).some(
    (types: readonly TokenProviderTokenType[]) => types.includes(tokenType),
  );

  if (!isTokenTypeSupported) {
    throw new TokenProviderError(
      ERR_DESCRIPTION.TOKEN_PROVIDER.UNSUPPORTED_TOKEN_TYPE,
    );
  }
}
