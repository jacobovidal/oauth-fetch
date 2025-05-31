import { SUPPORTED_TOKEN_TYPES } from "../../constants/index.js";
import { AbstractTokenProvider } from "../../providers/abstract-token-provider.js";
import {
  TokenProviderGetTokenResponse,
  TokenProviderTokenType,
} from "../../types/token-provider.types.js";

export class MockTokenProvider extends AbstractTokenProvider {
  private tokenType;
  private accessToken;

  constructor({
    tokenType = SUPPORTED_TOKEN_TYPES.BEARER,
    accessToken = "my-mock-access-token",
  }: {
    tokenType?: TokenProviderTokenType;
    accessToken?: string;
  } = {}) {
    super();
    this.tokenType = tokenType;
    this.accessToken = accessToken;
  }

  async getToken(): Promise<TokenProviderGetTokenResponse> {
    try {
      return {
        access_token: this.accessToken,
        token_type: this.tokenType,
      };
    } catch {
      throw new Error("Failed to retrieve access token.");
    }
  }
}
