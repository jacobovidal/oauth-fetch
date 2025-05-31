import { AbstractTokenProvider, SUPPORTED_TOKEN_TYPES } from "oauth-fetch";
import type { TokenProviderGetTokenResponse } from "oauth-fetch";
import type { GetTokenOptions, UseAuthReturn } from "@clerk/types";

export class ClerkTokenProvider extends AbstractTokenProvider<GetTokenOptions> {
  private clerk;

  constructor(clerk: UseAuthReturn, config?: GetTokenOptions) {
    super(config);
    this.clerk = clerk;
  }

  async getToken(): Promise<TokenProviderGetTokenResponse> {
    try {
      const accessToken = await this.clerk.getToken(this.config);

      if (!accessToken) {
        throw new Error();
      }

      return {
        access_token: accessToken,
        token_type: SUPPORTED_TOKEN_TYPES.BEARER,
      };
    } catch {
      throw new Error("Failed to retrieve access token.");
    }
  }
}
