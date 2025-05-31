import { AbstractTokenProvider, SUPPORTED_TOKEN_TYPES } from "oauth-fetch";
import { useAuth } from "@workos-inc/authkit-react";
import type { TokenProviderGetTokenResponse } from "oauth-fetch";

export class WorkOSTokenProvider extends AbstractTokenProvider {
  private workos;

  constructor(workos: typeof useAuth) {
    super();
    this.workos = workos();
  }

  async getToken(): Promise<TokenProviderGetTokenResponse> {
    try {
      const accessToken = await this.workos.getAccessToken();

      return {
        access_token: accessToken,
        token_type: SUPPORTED_TOKEN_TYPES.BEARER,
      };
    } catch {
      throw new Error("Failed to retrieve access token.");
    }
  }
}
