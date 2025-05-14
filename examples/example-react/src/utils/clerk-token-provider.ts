import {
  AbstractTokenProvider,
  type TokenProviderGetTokenResponse,
} from "oauth-fetch";
import { type GetTokenOptions, type UseAuthReturn } from "@clerk/types";

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
        token_type: "Bearer",
      };
    } catch {
      throw new Error("Failed to retrieve access token.");
    }
  }
}
