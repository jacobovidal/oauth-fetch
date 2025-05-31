import { SUPPORTED_TOKEN_TYPES } from "../constants/index.js";

export type TokenProviderTokenType =
  (typeof SUPPORTED_TOKEN_TYPES)[keyof typeof SUPPORTED_TOKEN_TYPES];

/**
 * Represents the response from a token acquisition operation.
 * Contains the access token and its type for use in API requests.
 */
export type TokenProviderGetTokenResponse = {
  /**
   * The OAuth access token value used for API authorization.
   * This token should be included in the Authorization header of API requests.
   */
  access_token: string;

  /**
   * The type of token returned, which determines how it should be used in requests.
   * Common types include "Bearer" and "DPoP" (Demonstrating Proof-of-Possession).
   */
  token_type: TokenProviderTokenType;
};
